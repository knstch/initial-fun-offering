import rightArrow from "../../../assets/right_arrow.png"
import styles from "./TrendingCampaigns.module.css"

const TrendingCampaigns = () => {
    return (
        <section>
            <div className={styles.trendingCampaignsTitleGroup}>
                <h3 className={styles.trendingCampaignsTitle}>Trending campaigns</h3>
                <img src={rightArrow} alt="rightArrow"/>
            </div>
            <div>

            </div>
        </section>
    )
}

export default TrendingCampaigns;