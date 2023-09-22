import growthup_icon from '../assets/grow icon.png'
import growthdown_icon from '../assets/growd icon.png'
import card_background from '../assets/BG.png'

type CardProps = {
    title: string;
    value: number;
    growth_rate: number;
    icon: string;
    date_range: string;
  };

function Card({title, value, growth_rate, icon, date_range}: CardProps) {

    const growthIcon = growth_rate > 0 ? growthup_icon : growthdown_icon;

    return (
        <div
            style={{backgroundImage: `url(${card_background})`}} 
            className="bg-[#0b0b0b] bg-cover bg-no-repeat bg-left-top bg-clip-border border border-gray-700 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl px-5 pt-5 pb-6 ">
            <div className="inline-block border border-gray-600 rounded-full mb-4 px-4 py-1">
                <img src={icon} alt="globe" className="" />
            </div>
                <h2 className="text-white font-medium text-5xl mb-3 flex items-end">{value}
                    <div className="ml-2 pb-1">
                        <div className="flex items-center">
                            <img src={growthIcon} alt="growth" className="mr-1" />
                            <p className="text-xs">{growth_rate}%</p>    
                        </div>
                        <p className="text-xs mt-1 text-gray-400">{date_range}</p>
                    </div>
                </h2> 
                <p className="text-white text-sm">{title}</p>
        </div>
    );
}

export default Card;
