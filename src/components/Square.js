import React from "react";

const Square = function ({idx, value, onClick}) {
    return (
        <div className="box" onClick={onClick} key={idx}>{value}</div>
    )
}

export default Square