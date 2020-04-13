<template>
    <div id="main">
        <Header title="蓝猫电影"/>
            <div id="content">
                <div class="movie_menu">
                    <router-link tag="div" to="/movie/city" class="city_name">
                    <span>{{ $store.state.city.nm }}</span><i class="iconfont iconsanjiao"></i>
                    </router-link>
                    <div class="hot_swtich">
                        <router-link tag="div" to="/movie/nowPlaying" class="hot_item">正在热映</router-link>
                        <router-link tag="div" to="/movie/comingSoon" class="hot_item">即将上映</router-link>
                    </div>
                    <router-link tag="div" to="/movie/search" class="search_entry">
                        <i class="iconfont iconsousuo"></i>
                    </router-link>
                </div>
                <keep-alive>
                    <router-view />
                </keep-alive>               
            </div>
             <router-view name="detail" />
        <TabBar />
       
    </div>
</template>

<script>

import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { messageBox } from '@/components/JS'
import { setTimeout } from 'timers';


export default {
    name: 'Movie',
    components:{
        Header,
        TabBar
    },
    mounted(){
        //获取城市定位
        setTimeout(()=>{
            this.axios.get('/api/getLocation').then((res)=>{

                var msg = res.data.msg;
                if(msg === 'ok'){
                    if(res.data.data.nm){
                        var nm = res.data.data.nm;
                        var id = res.data.data.id;
                        if( this.$store.state.city.id == id ){return;}

                        messageBox({
                            title : '定位',
                            content : nm,
                            cancel : '取消',
                            ok : '切换定位',
                            handleOk(){
                                window.localStorage.setItem('nowNm',nm);
                                window.localStorage.setItem('nowId',id);
                                window.location.reload();                            
                            }
                        })
                    } 
                }

            })

        },3000);
    
      
    }
}
</script>

<style scoped>/*Movie*/
#content .movie_menu{ width: 100%;border-bottom: 1px solid #e6e6e6;z-index: 1; display:-webkit-box;justify-content: flex-start;background-color:#fff; }
.movie_menu .city_name{flex:1; margin-left: 20px; height: 45px; line-height: 45px;}
.movie_menu .city_name.active{ color: #ef4238; height: 45px;border-bottom: 2px #ef4238 solid;}
.movie_menu .city_name.router-link-active{ color: #ef4238; border-bottom: 2px #ef4238 solid;}
.movie_menu .hot_swtich{flex:1; display: flex; height: 100%; line-height: 45px;}
.movie_menu .hot_item{ font-size: 15px; color:#666; width: 80px; text-align: center; margin:0 12px; font-weight: 700;}
.movie_menu .hot_item.active{ color:#ef4238; border-bottom: 2px #ef4238 solid;}
.movie_menu .hot_item.router-link-active{ color:#ef4238; border-bottom: 2px #ef4238 solid;}
.movie_menu .search_entry{flex:1; margin-right: 20px; height: 100%; line-height: 45px;}
.movie_menu .search_entry.active{ color: #ef4238; border-bottom: 2px #ef4238 solid;}
.movie_menu .search_entry.router-link-active{ color: #ef4238; border-bottom: 2px #ef4238 solid;}
.movie_menu .search_entry i{ font-size: 24px; }
</style>

