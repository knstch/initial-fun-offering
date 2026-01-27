import MainPageImage from "../../assets/main_page_img.png"
import styles from "./MainPage.module.css"
import Button from "../UIElements/Button";
import TrendingCampaigns from "./TrendingCampaigns/TrendingCampaigns";

const MainPage = () => {
    return (
        <main>
            <section className={styles.welcomeBlock}>
                <img className={styles.welcomeImage} src={MainPageImage} alt={"main page img"}/>
                <div className={styles.welcomeBlockContent}>
                    <h1>DYOR.Invest.
                        Earn.</h1>
                    <span>Initial Fun Offering is a crowdfunding platform available for everyone, join any campaign or create it in a few clicks.</span>
                    <div className={styles.buttonGroup}>
                        <Button text={"Browse campaigns"}></Button>
                        <Button isSecondary={true} text={"Read Documentation"}></Button>
                    </div>
                </div>
            </section>
            <TrendingCampaigns />
        </main>
    )
}

export default MainPage;