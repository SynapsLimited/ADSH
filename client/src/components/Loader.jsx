import React from "react";
import LoadingGif from '../assets/loading.gif'

const Loader = () => {
    return (
        <div className="loader">
            <div className="loader-image">
                <img src={LoadingGif} alt="" />
            </div>
        </div>
    )
}


export default Loader