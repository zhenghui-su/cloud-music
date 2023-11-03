import React, { useState } from 'react'
import Horizen from '../../baseUI/horizen-item'
import { categoryTypes, alphaTypes } from '../../api/config'
import { NavContainer } from './style'

function Singers() {
    let [category, setCategory] = useState('');
    let [alpha, setAlpha] = useState('');

    let handleUpdateCategory = (val) => {
        setCategory(val);
    }

    let handleUpdateAlpha = (val) => {
        setAlpha(val);
    }

    return (
        <NavContainer>
            <Horizen
                list={categoryTypes}
                title={"分类 (默认热门):"}
                handleClick={handleUpdateCategory}
                oldVal={category}></Horizen>
            <Horizen
                list={alphaTypes}
                title={"首字母:"}
                handleClick={handleUpdateAlpha}
                oldVal={alpha}></Horizen>
        </NavContainer>
    )
}

export default React.memo(Singers)