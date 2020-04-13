<template>
    <div id="main">
        <Header title="蓝猫影院"/>
        <div id="content">            
            <div class="cinema_menu">
                <div class="city_switch">
                    全城<i class="iconfont iconsanjiao"></i>
                </div>
                <div class="city_switch">
                    品牌<i class="iconfont iconsanjiao"></i>
                </div>
                <div class="city_switch">
                    特色<i class="iconfont iconsanjiao"></i>
                </div>
            </div>
            <CiList />
        </div>
        <TabBar />
    </div>
</template>

<script>

import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import CiList from '@/components/CiList';

export default {
    name : 'Cinema',
    components:{
        Header,
        TabBar,
        CiList
    }
}
</script>

<style scoped>
#content .cinema_menu{ width:100%; height: 45px;line-height: 45px; border-bottom: 1px solid #e6e6e6; z-index:1; display: -webkit-box;justify-content: space-around;background-color: #fff;}
.cinema_menu .city_switch{ flex: 1;text-align: center;}   

</style>

