<template>    
    <div class="movie_body" > 
        <Loading v-if="isLoading"></Loading> 
        <Scroller v-else> 
             
            <div>
                <p  v-if="comingList == ''">{{ noData }}</p>
            <ul>
                <!-- <li>
                    <div class="pic_show"><img src="/images/movie_2.jpg" alt=""></div>
                    <div class="info_list">
                        <h2>标题</h2>
                        <p><span class="person">44455</span> 人想看</p>
                        <p>主演：</p>
                        <p>2019-12-30上映</p>                       
                    </div>
                    <div class="btn_pre">预售</div> 
                </li> -->
                
                <li v-for="item in comingList" :key="item.id" >
                    <div class="pic_show"  @tap="handleToDetail(item.id)"><img :src="item.img | setWH('128.180')" alt=""></div>
                    <div class="info_list">
                        <h2 @tap="handleToDetail(item.id)">{{ item.nm}} <img v-if="item.version" src="@/assets/view_3d.png" alt=""/></h2>
                        <p><span class="person">{{ item.wish }}</span> 人想看</p>
                        <p>主演：{{ item.star }}</p>
                        <p>上映时间：{{ item.rt }}</p>                       
                    </div>
                    <div class="btn_pre">预售</div> 
                </li>
            </ul>
            </div>  
        </Scroller>
    </div>     
    
</template>

<script>
export default {
    name : 'ComingSoon',
    data(){
        return {
            comingList : [],
            noData :'',
            pullDownMsg : '',
            isLoading : true,
            prevCityId : -1
        };
    },
    activated(){
        var cityId = this.$store.state.city.id;
        if ( this.prevCityId === cityId ){ return; }
        this.isLoading = true;
        this.axios.get('/api/movieComingList?cityId='+cityId).then((res)=>{
            var msg = res.data.msg;
            if(msg === 'ok'){
                if(res.data.data.comingList){
                    this.comingList = res.data.data.comingList;
                    this.isLoading = false;

                }else{
                    this.noData = '无数据';
                    this.isLoading = false;
                    this.comingList = [
                        {
                            id:1190122,
                            haspromotionTag : false,
                            img : 'http://p0.meituan.net/w.h/movie/a3d6ca3bdd5b0ddd7016acff9a9f2f2e2805813.jpg',
                            version : '',
                            nm : '(测试)叶问4：完结篇',
                            preShow : false,
                            sc : 0,
                            globalReleased : false,
                            wish: 426078,
                            star : '甄子丹，吴樾，吴建豪,',
                            rt : '2019-12-20',
                            showInfo : '2019-12-20',
                            showst : 4,
                            wishst : 0,
                            comingTitle :'12月20日 周五'
                        },
                        {
                            id:1206605,
                            haspromotionTag : false,
                            img : 'http://p1.meituan.net/w.h/movie/9064b787a533d85fa2d2f8ad486351861051512.jpg',
                            version : '',
                            nm : '半个喜剧',
                            preShow : false,
                            sc : 9.6,
                            globalReleased : false,
                            wish: 40834,
                            star : '任素汐，吴昱翰，刘迅',
                            rt : '2019-03-08',
                            showInfo : '2019-03-08',
                            showst : 4,
                            wishst : 0,
                            comingTitle :'3月8日 周五'
                        },
                        {
                            id:1206606,
                            haspromotionTag : false,
                            img : 'http://p1.meituan.net/w.h/movie/e6a78a25fcc66f8bd6ac58c66ce305151928945.jpg',
                            version : '3D',
                            nm : '星球大战：天行者崛起',
                            preShow : false,
                            sc : 9.6,
                            globalReleased : false,
                            wish: 40834,
                            star : '维果.莫腾森，马克·哈米尔，亚当·德赖弗',
                            rt : '2019-12-20',
                            showInfo : '2019-12-20',
                            showst : 4,
                            wishst : 0,
                            comingTitle :'12月20日 周五'
                        },
                        {
                            id:1206607,
                            haspromotionTag : false,
                            img : 'http://p1.meituan.net/w.h/movie/c9b280de01549fcb71913edec05880585769972.jpg',
                            version : '3D',
                            nm : '冰雪奇缘2',
                            preShow : false,
                            sc : 9.6,
                            globalReleased : false,
                            wish: 40834,
                            star : '克里斯汀·贝尔，乔什·加德，伊迪娜·门泽尔',
                            rt : '2019-03-08',
                            showInfo : '2019-12-20',
                            showst : 4,
                            wishst : 0,
                            comingTitle :'3月8日 周五'
                        },
                        {
                            id:1206608,
                            haspromotionTag : false,
                            img : 'http://p1.meituan.net/w.h/movie/e6a78a25fcc66f8bd6ac58c66ce305151928945.jpg',
                            version : '3D',
                            nm : '星球大战2：天行者崛起',
                            preShow : false,
                            sc : 9.6,
                            globalReleased : false,
                            wish: 40834,
                            star : '维果.莫腾森，马克·哈米尔，亚当·德赖弗',
                            rt : '2019-12-20',
                            showInfo : '2019-12-20',
                            showst : 4,
                            wishst : 0,
                            comingTitle :'12月20日 周五'
                        },
                        {
                            id:1206609,
                            haspromotionTag : false,
                            img : 'http://p1.meituan.net/w.h/movie/e6a78a25fcc66f8bd6ac58c66ce305151928945.jpg',
                            version : '3D',
                            nm : '星球大战3：天行者崛起',
                            preShow : false,
                            sc : 9.6,
                            globalReleased : false,
                            wish: 40834,
                            star : '维果.莫腾森，马克·哈米尔，亚当·德赖弗',
                            rt : '2019-12-20',
                            showInfo : '2019-12-20',
                            showst : 4,
                            wishst : 0,
                            comingTitle :'12月20日 周五'
                        }

                        ]


                }
                
            }
        })
    },
    methods : {
        handleToDetail(movieId){
            //console.log(movieId);
            this.$router.push('/movie/detail/2/' + movieId);
        }

    }

}
</script>

<style scoped>
 #content .movie_body{flex:1; overflow: auto;margin-bottom: 50px; }
    .movie_body ul{ margin: 0 12px; overflow: hidden;}
    .movie_body ul li{margin-top:12px; display: flex; align-items: center; border-bottom: 1px #e6e6e6 solid; padding-bottom: 10px;}
    .movie_body .pic_show{ width:64px; height: 90px;}
    .movie_body .pic_show img{ width:100%;}
    .movie_body .info_list { margin-left: 10px;flex:1;position: relative;}
    .movie_body .info_list h2{ font-size: 17px; line-height: 24px; width:150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
    .movie_body .info_list p{ font-size:13px;line-height: 22px;width:200px;overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
    .movie_body .info_list .grade{ font-weight: 700; color: #faaf00;font-size: 15px}
    .movie_body .info_list img{ width: 20px; position: absolute; right: 10px; top: 5px;}
    .movie_body .btn_mall , .movie_body .btn_pre{ width:47px; height: 27px; line-height: 28px; text-align: center;background-color: #f09d37;color: #fff; border-radius: 4px; font-size: 12px; cursor: pointer;}
    .movie_body .btn_pre{ background-color: #3c9fe6;}


</style>
