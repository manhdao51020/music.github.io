    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const getPlaylist = $('.playlist');
    const cd = $('.cd');
    const getHeader = $('header h2');
    const getCdThumb = $('.cd-thumb');
    const getAudio = $('#audio');
    const playbtn = $('.btn-toggle-play');
    const player = $('.player');
    const progress = $('#progress');
    const next = $('.btn-next');
    const prev = $('.btn-prev');
    const randombtn = $('.btn-random');
    const repeatbtn = $('.btn-repeat');

    const app = {
        currentIndex:0,
        isPlaying:false,
        isRandom:false,
        isRepeat:false,
        songs: [
            {
                name : 'The Playah ',
                singer : 'Soobin Hoang Sơn',
                path : './music/The Playah Special Performance_ - Soobin.mp3',
                image: './image/theplayah.jpg'
            },
            {
                name: "Astronaut In The Ocean",
                singer: "Masked Worf",
                path: "./music/Astronaut In The Ocean - Masked Wolf.mp3",
                image: "./image/astronautintheocean.jpg"
            },
            {
                name: "At My Worst",
                singer: "Pink Sweat$",
                path: "./music/At My Worst Kehlani Remix_ - Pink Sweat_.mp3",
                image:"./image/atmyworst.jpg"
            },
            {
                name : 'Leave The Door Open',
                singer : 'Bruno Mars',
                path : './music/Leave The Door Open - Bruno Mars_ Anders.mp3',
                image: './image/leavethedooropen.jpg'
            },
            {
                name : 'Stressed Out',
                singer : 'Twenty One Pilots',
                path : './music/Stressed Out - Twenty One Pilots.mp3',
                image: './image/stressedout.jpg'
            },
            {
                name : 'Cypher Nhà Làm',
                singer : 'Low G',
                path : './music/Cypher Nha Lam - Low G Teddie J_ Chi Res.mp3',
                image: './image/chiasenhac.jpg'
            },
            {
                name : 'Răng khôn',
                singer : 'Phí Phương Anh',
                path : './music/Rang Khon - Phi Phuong Anh_ RIN9.mp3',
                image: './image/rangkhon.jpg'
            },
            {
                name : 'Deja Vu',
                singer : 'Olivia Rodrigo',
                path : './music/Deja Vu - Olivia Rodrigo.mp3',
                image: './image/dejavu.jpg'
            },
            {
                name : 'Mood',
                singer : 'Lil Ghost',
                path : './music/Mood Lil Ghost Remix_ - 24KGoldn Iann Di.mp3',
                image: './image/mood.jpg'
            },
            {
                name : 'Save Your Tears (Remix)',
                singer : 'The Weeknd',
                path : './music/Save Your Tears Remix_ - The Weeknd_ Ari.mp3',
                image: './image/saveyourtears.jpg'
            },
            {
                name : 'Trốn tìm',
                singer : 'Đen',
                path : './music/Tron Tim - Den_ MTV.mp3',
                image: './image/trontim.jpg'
            }

        ],
        render: function(){
            const htmls = this.songs.map((song,index) => {
                return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                        <div class="thumb" 
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                `
            })
            getPlaylist.innerHTML = htmls.join('');
        },
        handleEvents:function(){
            const _this = this;
            const cdwidth = cd.offsetWidth

            // Khi chạy bài hát CD quay

            const cdThumbAnimate = getCdThumb.animate([
                {transform:'rotate(360deg)'}
            ],{
                duration : 10000, // quay trong 1s
                iterations: Infinity
            })
            cdThumbAnimate.pause()
            
            // Xử lý phóng to / thu nhỏ CD
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newWidth = cdwidth - scrollTop;
                cd.style.width = newWidth >0 ? newWidth + 'px' : 0;
                cd.style.opacity = newWidth / cdwidth;
            }
            // Xử lý khi click play
            playbtn.onclick = function(){
                if(_this.isPlaying){
                    getAudio.pause()
                }else{
                    getAudio.play()
                }
            }
            // khi bài hát được chạy
            getAudio.onplay = function(){
                _this.isPlaying = true
                player.classList.add('playing');
                cdThumbAnimate.play()
            }
            // khi bài hất bị dừng
            getAudio.onpause = function(){
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            // khi chạy bài hát input chạy theo time
            getAudio.ontimeupdate = function(){
                if(getAudio.duration){
                    const progressPercent = Math.floor(getAudio.currentTime / getAudio.duration * 100)
                    progress.value = progressPercent;
                }
            }
            // Xử lý khi tua bài hát
            progress.onchange = function(e){
                const seekTime = getAudio.duration / 100 * e.target.value;
                getAudio.currentTime = seekTime;
            }

            // Xử lý khi phát bài hát tiếp theo
            next.onclick = function(){
                if(_this.isRandom){
                    _this.randomSongs()
                }else{
                    _this.nextSongs()
                }
                getAudio.play()
                _this.render()
                _this.ScrollToActiveSong()
            }
            // Xử lý khi trở về bát hát trước
            prev.onclick = function(){
                if(_this.isRandom){
                    _this.randomSongs()
                }
                else{
                    _this.prevSongs()
                }
                getAudio.play()
                _this.render()
                _this.ScrollToActiveSong()

            }  

            // xử lý khi click vào nút random bài hát 
            randombtn.onclick = function(){
                _this.isRandom = !_this.isRandom
                randombtn.classList.toggle('active',_this.isRandom);
                
            }

            // Xử lý khi lặp lại 1 bài hát
            repeatbtn.onclick = function(){
                _this.isRepeat = !_this.isRepeat
                repeatbtn.classList.toggle('active',_this.isRepeat);
            }

            // Xử lý next song khi bài hát end hoặc xử lý lặp lại bài khi ấn nút repeat
            getAudio.onended = function(){
                if(_this.isRepeat){
                    getAudio.play()
                }else{
                    next.click()
                }
            }

            // Lắng nghe hàm khi click vào playlist
            getPlaylist.onclick = function (e){
                const songNode = e.target.closest('.song:not(.active)')
                if(songNode || e.target.closest('.option')){
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        getAudio.play()
                    }
                }
            }
        },
        // Đọc dữ liệu mảng đầu tiên
        defineProperties:function(){
            Object.defineProperty(this,'currentSong',{
                get:function(){
                    return this.songs[this.currentIndex]
                }
            })
        },
        // Đọc dữ liệu mảng đầu tiên và in vào element
        loadCurrentSong:function(){
            getHeader.textContent = this.currentSong.name
            getCdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            getAudio.src = this.currentSong.path
        },

        // Click next Song
        nextSongs:function(){
            this.currentIndex++
            if(this.currentIndex >= this.songs.length){
                this.currentIndex = 0
            }
            this.loadCurrentSong()
        },

        // Click prev Song
        prevSongs:function(){
            this.currentIndex--
            if(this.currentIndex < 0 ){
                this.currentIndex = this.songs.length -1
            }
            this.loadCurrentSong()
        },

        // Click Random Song
        randomSongs:function(){
            let newIndex
            do {
                newIndex = Math.floor(Math.random()*this.songs.length)
            }while ( newIndex === this.currentIndex)
            this.currentIndex = newIndex
            this.loadCurrentSong()
        },

        // Scroll khi Active Song
        ScrollToActiveSong:function(){
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior : 'smooth',
                    block :'center',
                    inline:'nearest'
                });
            }, 500);  
        },
        start:function(){
            // Định nghĩa các thuộc tính cho object
            this.defineProperties();

            // Lắng nghe / xử lý các sự kiện (DOM EVENT)
            this.handleEvents();

            // Load bài hát đầu tiên vào UI khi chạy ứng dụng
            this.loadCurrentSong();

            // render playlist
            this.render();
        }
    }
    app.start()
