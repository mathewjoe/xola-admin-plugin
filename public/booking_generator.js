class BookingGeneratorPage {
  constructor (options) {
    this.baseUrl = options.baseUrl;
    this.sellerId = options.sellerId;
    this.apiKey = options.apiKey;
    this.defaultHeaders = {
      'X-API-VERSION': '2018-10-01'
    };

    this.setAdminEmail();
    this.setSellerName();

    this.startDate = this.getTomorrow();
    this.endDate = this.get30DaysFromTomorrow();
  };

  async setAdminEmail() {
    const url = `${this.baseUrl}/api/users/me`;
    const headers = this.defaultHeaders;
    headers['X-API-KEY'] = this.apiKey;

    const response = await $.ajax({
      url: url,
      type: "GET",
      headers: headers
    });

    this.adminEmail = response.email;
  }

  async setSellerName() {
    const url = `${this.baseUrl}/api/sellers/${this.sellerId}`;
    const headers = this.defaultHeaders;
    headers['X-API-KEY'] = this.apiKey;

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

    const min = orderMin || 1;
    max = Math.min(max, (min * 4));

    const options = _.range(min, (max + 1));
    return options.length === 0 ? 0 : options[Math.floor(Math.random()*options.length)];
  };

  getDemographicJson(demographicId, quantity) {
    return {
      "demographic" : {
        "id": demographicId
      },
      "quantity": quantity
    };
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
    if (!quantity) {
      return null;
    }
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
    const maxBookings = possibleTrips.length > 50 ? 50 : possibleTrips.length;
    return _.sampleSize(possibleTrips, maxBookings);
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
            viableTrips.push($.extend(true, {}, trip));
          }
        } else {
          const arrivalTimes = arrivalDates[date];
          for (const arrivalTime in arrivalTimes) {
            trip.arrivalTime = arrivalTime;
            trip.availability = arrivalTimes[arrivalTime];
            if (trip.availability) {
              viableTrips.push($.extend(true, {}, trip));
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
    const headers = this.defaultHeaders;
    headers['X-API-KEY'] = this.apiKey;

    const allExperiences = await $.ajax({
      url: url,
      type: "GET",
      headers: headers
    });

    const availableExperiences = [];
    for(let experience in allExperiences) {
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
    const cards = [
      "4242424242424242",
      "4000056655665556",
      "5555555555554444",
      "2223003122003222",
      "5200828282828210",
      "5105105105105100",
      "378282246310005",
      "371449635398431",
      "6011111111111117",
      "6011000990139424",
      "30569309025904",
      "38520000023237",
      "3566002020360505",
      "6200000000000005"
    ];
    orderPayload.payment = {
      "card": {
        "number": cards[Math.floor(Math.random()*cards.length)],
        "cvv":"123",
        "billingName": orderPayload.customerName,
        "expiryMonth":"12",
        "expiryYear":((new Date()).getFullYear() + 4).toString(),
        "billingPostcode":"00000"
      },
      "method":"cc"
    };
    if (!orderPayload.tags) {
      orderPayload.tags = [];
    }
    orderPayload.tags.push("generated");
    return orderPayload
  }

  async createOrder(payload) {
    const url = `${this.baseUrl}/api/orders`;
    const headers = this.defaultHeaders;
    headers['X-API-KEY'] = this.apiKey;

    return await $.ajax({
      url: url,
      type: "POST",
      headers: headers,
      contentType: 'application/json',
      data: JSON.stringify(payload)
    });
  };

  async bookATrip(trip) {
    try {
      const experience = await this.getExperience(trip.experience.id);
      const prepareOrderPayload = this.getOrderPreparePayload(experience, trip.availability, trip.arrival, trip.arrivalTime);
      if(!prepareOrderPayload) {
        return -1;
      }
      let orderPayload = await this.prepareOrder(prepareOrderPayload);
      orderPayload = this.addCustomerDetailsToOrderPayload(orderPayload);
      const order = await this.createOrder(orderPayload);

      return order.id;
    }catch (e) {
      return -1;
    }
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
    const chosenTrips = this.chooseUpto50Trips(possibleTrips);

    const values = [];
    for (const index in chosenTrips) {
      values.push(await this.bookATrip(chosenTrips[index]));
    }

    const numOrdersCreated = values.filter(orderId => orderId !== -1).length;
    return `${numOrdersCreated} orders created`;
  };

  async run() {
    const message = await this.bookAtmost50Trips();
    alert(message + "\n\n Reimpersonate to see your new bookings");
  }
}
chrome.runtime.onMessage.addListener(function(request, sender, reply) {
    if (request.action === "backgroundDemoBookingGenerator") {
      let demoBookingGeneratorInChromeExt = new BookingGeneratorPage(request);
      demoBookingGeneratorInChromeExt.run();
    }
});
