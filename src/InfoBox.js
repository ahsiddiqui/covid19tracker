import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import numeral from "numeral"; 

function InfoBox({ title, subtitle, cases, isRed, active, total, ...props }) {
    return (
        <Card 
            onClick={props.onClick} 
            className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}
        >
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{numeral(cases).format("0,0")}</h2>
                <Typography className="infoBox__title" color="textSecondary">{subtitle}</Typography>
                {/* <Typography className="infoBox__total" color="textSecondary">{total}</Typography> */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{numeral(total).format("0,0")}</h2>
            </CardContent>
        </Card>
    )
}

export default InfoBox;