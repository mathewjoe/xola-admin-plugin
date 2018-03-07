import React from "react";

export default function Icon(props) {
   props.size = props.size ? props.size : '';
   props.type = props.type ? props.type : 'fas';
   return <i className={`${props.type} fa-${props.name} ${props.size}`}></i>;
}

export function RegularIcon(props) {
   const {type, ...other} = props;
   return <Icon {...other} type="far"/>;
}

export function LargeIcon(props) {
   const {size, ...other} = props;
   return <Icon {...other} size="fa-lg"/>;
}

export function XLIcon(props) {
   const {size, ...other} = props;
   return <Icon {...other} size="fa-2x"/>;
}

export function XXLIcon(props) {
   const {size, ...other} = props;
   return <Icon {...other} size="fa-3x"/>;
}

export function XXXLIcon(props) {
   const {size, ...other} = props;
   return <Icon {...other} size="fa-4x"/>;
}
