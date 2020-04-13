<template>
  <div class="movie_body" >
    <Loading v-if="isLoading"></Loading> 
        <Scroller v-else :handleToScroll ="handleToScroll" :handleToTouchEnd="handleToTouchEnd">
        <p  v-if="movieList == ''">{{ noData }}</p>
        <ul>
            <!-- <li>
                <div class="pic_show"><img src="/image/movie_2.jpg" alt=""></div>
                <div class="info_list">
                    <h2>标题</h2>
                    <p>评分<span class="grade"></span></p>
                    <p>主演：</p>
                    <p>今天55家影院放映60场</p>                       
                </div>
                <div class="btn_mall">购票</div>
                
            </li> -->
            <li class="pullDown">{{ pullDownMsg }}</li>
            <li v-for="item in movieList" :key="item.id">
                <div class="pic_show" @tap="handleToDetail(item.id)"><img :src="item.img | setWH('128.180')" alt=""></div>
                <div class="info_list">
                    <h2 @tap="handleToDetail(item.id)">{{ item.nm }} <img v-if="item.version" src="@/assets/view_3d.png" alt=""/></h2>
                    <p>观众评<span class="grade">{{ item.sc }}</span></p>
                    <p>主演：{{ item.star }}</p>
                    <p>{{ item.showInfo}}</p>                       
                </div>
                <div class="btn_mall">购票</div>                
            </li>
        </ul> 
    </Scroller>
    
   </div>
    
</template>

<script>
// import BScroll from 'better-scroll'
import { setTimeout } from 'timers';

export default {
    name : 'NowPlaying',      
    data(){
        return {
            movieList : [],
            noData : '',
            pullDownMsg : '',
            isLoading　: true,
            prevCityId : -1
        }
    },
    activated(){
        var cityId = this.$store.state.city.id;
        if ( this.prevCityId === cityId ){ return; }
       // this.isLoading = true;    
        this.axios.get('/api/movieOnInfoList?cityId='+cityId).then((res)=>{
            var msg = res.data.msg;
            if( msg === 'ok' ){
                if(res.data.data.movieList){
                    this.movieList = res.data.data.movieList;
                    this.isLoading = false;
                    this.prevCityId = cityId;
                    // this.$nextTick(()=>{
                    //     var scroll = new BScroll( this.$refs.movie_body , {
                    //         tap : true,
                    //         probeType: 1
                    //     });
                    //     scroll.on('scroll',(pos)=>{
                    //         //console.log('scroll');
                    //         //下拉加载
                    //         if( pos.y > 30){
                    //             this.pullDownMsg = '更新中...';
                    //         }                            
                    //     });
                    //     scroll.on('touchEnd',(pos)=>{
                    //        // console.log('touchEnd');
                    //         if( pos.y > 30 ){
                    //             this.axios.get('/api/movieOnInfoList?cityId=10').then((res)=>{
                    //                  var msg = res.data.msg;
                    //                 if( msg === 'ok' ){
                    //                     this.pullDownMsg = '更新成功';
                    //                     if(res.data.data.movieList){
                    //                         setTimeout(()=>{
                    //                              this.movieList = res.data.data.movieList;
                    //                              this.pullDownMsg = '';

                    //                         },1000)
                                           
                    //                     }
                    //                 }

                    //             });
                        
                    //         }
                    //     })
                    //  });
                }else{
                    this.noData = '暂无数据';
                    this.isLoading = false;
                    this.movieList = [
                        {
                            id:341139,
                            haspromotionTag : false,
                            img : 'http://p0.meituan.net/w.h/movie/a3d6ca3bdd5b0ddd7016acff9a9f2f2e2805813.jpg',
                            version : '',
                            nm : '测试叶问4：完结篇',
                            preShow : false,
                            sc : 0,
                            globalReleased : false,
                            wish: 426078,
                            star : '甄子丹，吴樾，吴建豪,',
                            rt : '2019-12-20',
                            showInfo : '中国大陆 / 107分钟',
                            showst : 4,
                            wishst : 0
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
                            showInfo : '中国大陆 / 111分钟',
                            showst : 4,
                            wishst : 0
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
                            showInfo : '美国 / 142分钟',
                            showst : 4,
                            wishst : 0
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
                            showInfo : '美国 / 104分钟',
                            showst : 4,
                            wishst : 0
                        },
                        {
                            id:1206608,
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
                            showInfo : '美国 / 142分钟',
                            showst : 4,
                            wishst : 0
                        },

                        ]

                }
               
                
            }
        })
    },
    methods:{
        handleToDetail(movieId){
            //console.log(movieId);
            this.$router.push('/movie/detail/1/' + movieId);
        },
        handleToScroll(pos){
            if( pos.y > 30){
                this.pullDownMsg = '更新中...';
            } 
        },
        handleToTouchEnd(pos){
            if( pos.y > 30){
                    this.axios.get('/api/movieOnInfoList?cityId=10').then((res)=>{
                            var msg = res.data.msg;
                        if( msg === 'ok' ){
                            this.pullDownMsg = '更新成功';
                            if(res.data.data.movieList){
                                setTimeout(()=>{
                                        this.movieList = res.data.data.movieList;
                                        this.pullDownMsg = '';

                                },1000)
                                
                            }
                        }

                    });
            } 
        }

    }

}
</script>

<style scoped>/* NowPlaying*/
    #content .movie_body{margin-bottom: 50px; flex:1; overflow: auto;}
    .movie_body ul{ margin: 0 12px; overflow: hidden;}
    .movie_body ul li{margin-top:12px; display: flex; align-items: center; border-bottom: 1px #e6e6e6 solid; padding-bottom: 10px;}
    .movie_body .pic_show{ width:64px; height: 90px;}
    .movie_body .pic_show img{ width:100%;}
    .movie_body .info_list { margin-left: 10px;flex:1;position: relative;}
    .movie_body .info_list h2{ font-size: 17px; line-height: 24px; width:150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
    .movie_body .info_list p{ font-size:13px;line-height: 22px;width:200px;overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
    .movie_body .info_list .grade{ font-weight: 700; color: #faaf00;font-size: 15px}
    .movie_body .info_list img{ width: 20px; position: absolute;right: 10px; top: 1px;}
    .movie_body .btn_mall , .movie_body .brn_pre{ width:47px; height: 27px; line-height: 28px; text-align: center;background-color: #e54847;color: #fff; border-radius: 4px; font-size: 12px; cursor: pointer;}
    .movie_body .brn_pre{ background-color: #3c9fe6;}
    .movie_body .pullDown{ margin:0; padding:0; border:none;}
</style>
