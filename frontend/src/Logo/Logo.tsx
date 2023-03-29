import * as React from 'react';
import "./Logo.css"

export interface ILogoProps {
    width: number,
    height: number,
}

export default function Logo (props: ILogoProps) {
  return (
    <img width={"" + props.width + "px"} height={"" + props.height + "px"} className='logo' src={process.env.PUBLIC_URL + "/logo512.png"} alt="PostAPic logo"></img>
  );
}
