import React from "react";
import campaignImagePlaceholder from "../../assets/campaign_image_placeholder.png"
import {Truncate} from "../../helpers/turncate_text";
import Button from "../UIElements/Button";

interface CampaignCardProps {
    id: number;
    image?: string;
    title: string;
    ticker: string;
    owner: string;
    description: string;
    tokenCost: number;
    participants: number;
    softCap: number;
    totalSold: number;
}

const CampaignCard: React.FC<CampaignCardProps> = (props) => {
    return (
        <div>
            <div>
                <img src={props.image ? props.image : campaignImagePlaceholder} alt={props.title} />
                <div>
                    <span>{props.title}</span>
                    <span>{props.ticker}</span>
                    <span>Owner: {props.owner}</span>
                    <span>{Truncate(props.description, 50)}</span>
                </div>
            </div>
            <div>
                <div>
                    <span>Token cost: ${props.tokenCost} USD</span>
                    <span>Participants: {props.participants}</span>
                </div>
                <div>
                    <span>Soft cap: ${props.softCap} USD</span>
                    <span>Total sold: ${props.totalSold} USD</span>
                </div>
            </div>
            <div>
                <Button text={"Join"}></Button>
                <Button text={"Get details"}></Button>
            </div>
        </div>
    )
}

export default CampaignCard;