import React from "react";

const Square = function ({idx, value, onClick}) {
    return (
        <div className="box" onClick={onClick}>{value}</div>
    )
}

export default Square