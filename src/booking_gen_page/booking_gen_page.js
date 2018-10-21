import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import _range from 'lodash/range';
import $ from 'jquery';
import './booking_gen_page.css';
import faker from 'faker';

class BookingGeneratorPage extends Component  {
  constructor (props) {
    super(props)

    this.baseUrl = this.props.match.params.url.split('@').join('/');
    this.sellerId = this.props.match.params.sellerId;
    this.apiKey = this.props.match.params.apiKey;

    const promises = [this.setAdminEmail(), this.setSellerName()];

    this.startDate = this.getTomorrow();
    this.endDate = this.get30DaysFromTomorrow();
    this.showPrepMessage();
    Promise.all(promises).then(() => { this.showUnderstanding(); })
  };

  async setAdminEmail() {
    const url = `${this.baseUrl}/api/users/me`;
    const headers = {
      "X-API-KEY": this.apiKey
    };

    const response = await $.ajax({
      url: url,
      type: "GET",
      headers: headers
    });

    this.adminEmail = response.email;
  }

  async setSellerName() {
    const url = `${this.baseUrl}/api/sellers/${this.sellerId}`;
    const headers = {
      "X-API-KEY": this.apiKey
    };

    const response = await $.ajax({
      url: url,
      type: "GET",
      headers: headers
    });
    this.sellerName = response.name;
  }

  getMillisecondsInADay() {
    return 24 * 60 * 60 * 1000;
  };

  getTomorrow() {
    return new Date(Date.now() + this.getMillisecondsInADay());
  };

  addDaysToDate(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + parseInt(days));
    return newDate;
  };

  get30DaysFromTomorrow() {
    return this.addDaysToDate(this.getTomorrow(), 30);
  };

  getDateStringFromDate(date) {
    return date.toJSON().split('T')[0];
  };

  getQuantity(availability, orderMin=null, orderMax=null, outingMax=null) {
    let max = availability;
    max = (outingMax && (outingMax <= max)) ? outingMax : max;
    max = (orderMax && (orderMax <= max)) ? orderMax : max;

    const min = (orderMin && (orderMin > 1)) ? orderMin : 1;
    const options = _range(min, (max + 1));
    return options.length === 0 ? 0 : options[Math.floor(Math.random()*options.length)];
  };

  getDemographicJson(demographicId, quantity) {
    const demographic = {};
    demographic.demographic = {};
    demographic.demographic.id = demographicId;
    demographic.quantity = quantity;

    return demographic;
  };

  getDemographicsJsonForQuantity(availableDemographics, quantity) {
    let remainingCount = quantity;
    const demographicsJson = [];
    let demographicJson = {};

    while (remainingCount > 0) {
      let availableDemographicsCount = availableDemographics.length;
      if (availableDemographicsCount === 1) {
        demographicJson = this.getDemographicJson(availableDemographics[0].id, remainingCount);
        remainingCount = 0;
      } else {
        const chosenIndex = Math.floor(Math.random() * availableDemographicsCount);
        const chosenDemographic = availableDemographics.splice(chosenIndex, 1)[0];
        const chosenQuantity = Math.floor(Math.random() * remainingCount) + 1;
        remainingCount -= chosenQuantity;
        demographicJson = this.getDemographicJson(chosenDemographic.id, chosenQuantity);
      }
      demographicsJson.push(demographicJson);
    }
    return demographicsJson;
  };

  async getExperience(experienceId) {
    const url = `${this.baseUrl}/api/experiences/${experienceId}`;

    return await $.ajax({
      url: url,
      type: "GET",
    });
  };

  async prepareOrder(payload) {
    const url = `${this.baseUrl}/api/orders/prepare`;
    return await $.ajax({
      url: url,
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(payload)
    });
  };

  getOrderPreparePayload(experience, availability, arrival, arrivalTime=null) {
    const availableDemographics = $.extend(true, [], experience.demographics);
    const orderMin = experience.group.orderMin || null;
    const orderMax = experience.group.orderMax || null;
    const outingMax = experience.group.outingMax || null;
    const quantity = this.getQuantity(availability, orderMin, orderMax, outingMax);
    const demographics = this.getDemographicsJsonForQuantity(availableDemographics, quantity);

    const payloadItem = {};
    payloadItem.experience = { "id": experience.id };
    payloadItem.demographics = demographics;
    payloadItem.arrival = arrival;
    if (arrivalTime) {
      payloadItem.arrivalTime = arrivalTime;
    }
    payloadItem.quantity = quantity;

    const payload = {};
    payload.items = [];
    payload.items.push(payloadItem);

    return payload;
  };

  chooseUpto50Trips(possibleTrips) {
    const chosenTrips = [];
    const maxBookings = possibleTrips.length > 50 ? 50 : possibleTrips.length;
    for (let i = maxBookings-1; i>=0; i--) {
      chosenTrips.push(
        possibleTrips.splice(Math.floor(Math.random() * possibleTrips.length), 1)[0]
      );
    }
    return chosenTrips;
  };

  getAllViableTrips(availableExperiences) {
    const viableTrips = [];
    availableExperiences.forEach((experience) => {
      const trip = {};
      trip.experience = {"id": experience.id};
      const arrivalDates = experience.arrivalDates;
      for (const date in arrivalDates) {
        trip.arrival = date;
        if (Array.isArray(arrivalDates[date])) {
          trip.availability = arrivalDates[date][0];
          if (trip.availability) {
            viableTrips.push(trip);
          }
        } else {
          const arrivalTimes = arrivalDates[date];
          for (const arrivalTime in arrivalTimes) {
            trip.arrivalTime = arrivalTime;
            trip.availability = arrivalTimes[arrivalTime];
            if (trip.availability) {
              viableTrips.push(trip);
            }
          }
        }
      }
    });
    return viableTrips;
  };

  async getAllExperiencesWithAvailabilityIn30Days() {
    const startDateStr = this.getDateStringFromDate(this.startDate);
    const endDateStr = this.getDateStringFromDate(this.endDate);
    const url = `${this.baseUrl}/api/availability?seller=${this.sellerId}&start=${startDateStr}&end=${endDateStr}`;
    const headers = {
      "X-API-KEY": this.apiKey
    };
    const allExperiences = await $.ajax({
      url: url,
      type: "GET",
      headers: headers
    });

    const availableExperiences = [];
    for(var experience in allExperiences) {
      if (! Array.isArray(allExperiences[experience])) {
        const experienceAvailability = {};
        experienceAvailability.id = experience;
        experienceAvailability.arrivalDates = allExperiences[experience];
        availableExperiences.push(experienceAvailability);
      }
    }
    return availableExperiences;
  };

  getCustomEmail() {
    const fakeName = faker.internet.email().split('@')[0].substring(0,8);
    const adminName = this.adminEmail.split('@')[0];
    const emailDomain = this.adminEmail.split('@')[1];
    return `${adminName}+gen+${fakeName}@${emailDomain}`;
  }

  addCustomerDetailsToOrderPayload(orderPayload) {
    orderPayload.customerName = faker.name.findName();
    orderPayload.customerEmail = this.getCustomEmail();
    orderPayload.payment = { "method": "later" };
    if (!orderPayload.tags) {
      orderPayload.tags = [];
    }
    orderPayload.tags.push("generated");
    return orderPayload
  }

  async createOrder(payload) {
    const url = `${this.baseUrl}/api/orders`;
    const headers = {
      "X-API-KEY": this.apiKey
    };

    const response = await $.ajax({
      url: url,
      type: "POST",
      headers: headers,
      contentType: 'application/json',
      data: JSON.stringify(payload)
    });

    return response.id;
  };

  async bookATrip(trip) {
    const experience = await this.getExperience(trip.experience.id);
    const prepareOrderPayload = this.getOrderPreparePayload(experience, trip.availability, trip.arrival, trip.arrivalTime);
    let orderPayload = await this.prepareOrder(prepareOrderPayload);
    orderPayload = this.addCustomerDetailsToOrderPayload(orderPayload);
    await this.createOrder(orderPayload);
  };

  async bookAtmost50Trips() {
    const availableExperiences = await this.getAllExperiencesWithAvailabilityIn30Days();
    if (!availableExperiences) {
      return "No bookings were made ( 0 slots found for the next 30 days)";
    }
    const possibleTrips = this.getAllViableTrips(availableExperiences);
    if (!possibleTrips) {
      return "No bookings were made (0 seats available for the next 30 days)";
    }
    const chosenTrips = this.chooseUpto50Trips(possibleTrips)
    const promises = chosenTrips.forEach((trip) => {
      return this.bookATrip(trip)
    });

    return Promise.all(promises).then((values) => {
      return `All done, you should find ${chosenTrips.length} new bookings ${values}`;
    });
  };

  generateBookings() {
    this.bookAtmost50Trips().then((message) => {
      $('.one-piece .content .text-div .message').innerText = message;
      this.showReward();
    });
  };

  hideAllPages(render=true) {
    if (render) {
      this.render();
    }
    $('.preping-the-generator').hide();
    $('.statement-of-understanding').hide();
    $('.guard-of-verification').hide();
    $('.patience-of-the-wise').hide();
    $('.one-piece').hide();
  };

  showPrepMessage() {
    this.hideAllPages();
    $('.preping-the-generator').show();
  };

  showUnderstanding() {
    this.hideAllPages();
    $('.statement-of-understanding').show();
  };

  showVerification() {
    this.hideAllPages();
    $('.guard-of-verification').show();
  };

  showPatience() {
    this.hideAllPages();
    $('.patience-of-the-wise').show();
    this.generateBookings();
  };

  showReward() {
    this.hideAllPages(false);  // We don't want to clear out the values we just set
    $('.one-piece').show();
  };

  render() {
    const prepSection = (
      <div class="preping-the-generator">
        <div class="gen-page-wrapper">

          <div class="content">
            <div class="text-div">
              Prep-ing the generator...<br/>
              Please stand by
            </div>
          </div>

          <div class="options-div">
            <div class="decline action">
              <Link to="/search">
                <a href='#' className="chip">CLOSE</a>
              </Link>
            </div>
            <div class="accept action">
              <a href='#' className="chip" onClick={()=> {this.showVerification()}}>Continue</a>
            </div>
          </div>

        </div>
      </div>
    );

    const statementOfUnderstandingSection = (
      <div class="statement-of-understanding">
        <div class="gen-page-wrapper">

          <div class="content">
            <div class="text-div">
              Please ensure that you have selected the right&nbsp;
              <span class="highlighted">Environment</span>&nbsp; and&nbsp;
              <span class="highlighted">Seller</span><br/>
              You will be given a chance to verify these values on the next screen.<br/>
            </div>
          </div>

          <div class="options-div">
            <div class="decline action">
              <Link to="/search">
                <a href='#' className="chip">CLOSE</a>
              </Link>
            </div>
            <div class="accept action">
              <a href='#' className="chip" onClick={()=> {this.showVerification()}}>Continue</a>
            </div>
          </div>

        </div>
      </div>
    );

    const verificationSection = (
      <div class="guard-of-verification">
        <div class="gen-page-wrapper">

          <div class="content">
            <div class="text-div">
              You are attempting to make upto 50 bookings<br/>
              With user&nbsp;
              <span class="highlighted">{this.adminEmail}</span><br/>
              On the environment with url&nbsp;
              <span class="highlighted">{this.baseUrl}</span><br/>
              For &nbsp;
              <span class="highlighted">{this.sellerName}</span>
            </div>
          </div>

          <div class="options-div">
            <div class="decline action">
              <Link to="/search">
                <a href='#' className="chip">NO</a>
              </Link>
            </div>
            <div class="accept action">
              <a href='#' className="chip" onClick={()=> {this.showPatience();}}>YES</a>
            </div>
          </div>

        </div>
      </div>
    );

    const patienceSection = (
      <div class="patience-of-the-wise">
        <div class="gen-page-wrapper">

          <div class="content">
            <div class="text-div">
              Making bookings take time.<br/>
              A little patience goes a long way.<br/>
              Please await your confirmation.
            </div>
          </div>

          <div class="options-div">
            <div class="decline single-button action">
              <Link to="/search">
                <a href='#' className="chip">CLOSE</a>
              </Link>
            </div>
          </div>

        </div>
      </div>
    );

    const rewardSection = (
      <div class="one-piece reward">
        <div class="gen-page-wrapper">

          <div class="content">
            <div class="text-div">
              <span class="message"></span>
            </div>
          </div>

          <div class="options-div">
            <div class="decline single-button action">
              <Link to="/search">
                <a href='#' className="chip">CLOSE</a>
              </Link>
            </div>
          </div>

        </div>
      </div>
    );

    return (
      <div className="booking-generator container">
        <div className="container">
          { prepSection }
          { statementOfUnderstandingSection }
          { verificationSection }
          { patienceSection }
          { rewardSection }
        </div>
      </div>
    );
  }
}

export {BookingGeneratorPage};
