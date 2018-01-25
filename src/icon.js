import React from "react";

export default function Icon(props) {
   props.size = props.size ? props.size : '';
   return <i className={`fas fa-${props.name} ${props.size}`}></i>;
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
