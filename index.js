
const init = () => {
    let cnv = document.getElementById('canvas')
    let ctx = cnv.getContext('2d')
    var loaded = false
    var loadedItems = 0
    var started = false
    var score = 0
    var timer = 0
    var bounces = 1
    cnv.width = document.getElementById('container').offsetWidth
    cnv.height = document.getElementById('container').offsetHeight
    window.addEventListener('resize', () => {
        cnv.width = document.getElementById('container').offsetWidth
        cnv.height = document.getElementById('container').offsetHeight
    })
    let btn = document.querySelectorAll('#btn-start')
    btn[0].addEventListener('click',(e)=>{
        started = true
        e.target.style.display = 'none'
    })
    let veter = { 
        speedUp: 1,
        sila: 0,
        maxSila: 30,
        minSila: -30,
        reapeter: {
            last: false,
            times: 0,
        }
    }
    const end = () => {
        started = false
        score = 0
        timer = 0
        btn[0].style.display = 'block'
        activeShars = []
    }
    let shars = [...document.getElementsByClassName('shars')]
    let igolka = document.getElementById('igolka')
    igolka.onload = function() {
        loadedItems += 1 
            console.log(this.src)
            if(loadedItems === shars.length + 1 ){
                loaded = true
            }
    }
    let activeShars = []
    for(let key in shars){
        shars[key].onload = function() {
            loadedItems += 1 
            if(loadedItems === shars.length + 1 ){
                loaded = true
            }
        }
    }
    let igolkaLoaded = {
        src: igolka,
        y: 0,
        x: cnv.width / 2,
        scale: 0.2
    }
    const change = () => {
        score = score + 1
    }
    const changeTime = () => {
        timer = (timer + 1000 / 50)
        bounces = bounces + 0.00066
        console.log(bounces)
    }
    setInterval(()=>render(activeShars, igolkaLoaded, ctx, loaded,cnv.width,cnv.height, veter,started,score,timer,change,changeTime,end),1000/50)
    setInterval(()=>{
        if(activeShars.length < (10 * bounces) && loaded && started) {
            let shar = {
                src: shars[Math.floor(Math.random()*shars.length)],
                y: cnv.height,
                x: Math.floor(Math.random()*((cnv.width - (321 * 0.3)) - (321 * 0.3)) + (321 * 0.3)),
                sopr: Math.floor(Math.random() * 10),
                speed: Math.floor(Math.random() * (30 - 10) + 10),
                scale: 0.3,
                loaded: false,
                speedX: 0,
                maxSpeedX: 10,
                minSpeedX: -10,
                rotate: 0
            }
            console.log(activeShars)
            activeShars.push(shar)
        }
    }, [750])
    cnv.addEventListener('mousemove', (e)=>{
        igolkaLoaded.x = e.clientX - (window.innerWidth - cnv.width) / 2
    })
}

const render = (shar,igolka,ctx,loaded,cnvWidth,cnvHeight, veter, started, score, timer,change,changeTime,end) => {
    if(started){
        if(timer >= 60000){
            end()
            ctx.clearRect(0,0, cnvWidth, cnvHeight)
        }
        if(loaded === false)return 0
        ctx.clearRect(0,0, cnvWidth, cnvHeight)
    let deleteItem = null
    for(let item in shar){
        let width = shar[item].src.width
        let height = shar[item].src.height
        if(collision(shar[item],igolka)){
            deleteItem = item
            change()
        }
        if(shar[item].y + height < 0){
            deleteItem = item
        }
        ctx.save()
        ctx.translate(shar[item].x,shar[item].y)
        ctx.rotate(shar[item].rotate/180 * Math.PI )
        if(veter.sila > 0 && shar[item].rotate < 50){
            shar[item].rotate += 0.05 * shar[item].sopr
        }
        if(veter.sila < 0 && shar[item].rotate > -50){
            shar[item].rotate -= 0.05 * shar[item].sopr
        }
        ctx.drawImage(shar[item].src, 0,0, width*shar[item].scale, height*shar[item].scale)
        shar[item].y = shar[item].y - shar[item].speed / 10
        if(shar[item].speedX < shar[item].maxSpeedX && shar[item].speedX > shar[item].minSpeedX ){
            shar[item].speedX +=  ((veter.sila * 0.1) - (veter.sila > 0? shar[item].x * 0.1:-shar[item].x * 0.1)) / 2
        }
        if(shar[item].speedX >= shar[item].maxSpeedX){
            shar[item].speedX -= 1 
        }
        if(shar[item].speedX <= shar[item].minSpeedX){
            shar[item].speedX += 1 
        }
        if(shar[item].x + shar[item].src.width * 0.3 >= cnvWidth){
            shar[item].speedX = -1
        }
        if(shar[item].x <= 50){
            shar[item].speedX = 1
        }
        shar[item].x += shar[item].speedX * 0.1
        ctx.restore();
    }
        
        let width = igolka.src.width
        let height = igolka.src.height
        ctx.drawImage(igolka.src, igolka.x, igolka.y, width*igolka.scale, height*igolka.scale)
        ctx.font = "48px serif";
        ctx.fillStyle = '#fff'
        ctx.fillText(`score: ${score}`, cnvWidth - 200, 100, 400)
        ctx.fillText(`timer: ${Math.ceil(timer /1000)}`, 100, 100, 400)
        changeTime()
        if(deleteItem !== null){
            shar.splice(deleteItem, 1)
        }
        let znak = 0
        if(Math.floor(Math.random() < 0.5)){
            znak += veter.speedUp 
        }else{
            znak -= veter.speedUp
        }
        if(veter.sila < veter.maxSila && veter.sila > veter.minSila){
            veter.sila += znak 
        }
        if(veter.sila >= veter.maxSila){
            veter.sila -= veter.speedUp * 10
        }
        if(veter.sila <= veter.minSila){
            veter.sila += veter.speedUp * 10
        }
        if(veter.sila > 0 && veter.reapeter.last === true){
            veter.reapeter.times += 1
            veter.reapeter.last = true
        }
        if(veter.sila > 0 && veter.reapeter.last === false){
            veter.reapeter.times = 0
            veter.reapeter.times += 1
            veter.reapeter.last = true
        }
        if(veter.sila < 0 && veter.reapeter.last === true){
            veter.reapeter.times = 0
            veter.reapeter.times += 1
            veter.reapeter.last = false
        }
        if(veter.sila < 0 && veter.reapeter.last === false){
            veter.reapeter.times += 1
            veter.reapeter.last = false
        }
        if(veter.reapeter.times === 60 ){
                let newData = 0
                newData -= veter.sila 
                veter.sila = newData
        }
    }else{

    }
}

function collision(objA, igolka) {

    if (objA.x+objA.src.width * 0.3  > igolka.x &&
        objA.x < igolka.x+igolka.src.width * 0.3 &&
        objA.y+objA.src.height * 0.3 > igolka.y &&
        objA.y < igolka.y + (igolka.src.height * 0.2 - 30)) {
            return true;
        }
        else {
            return false;
            }
    }
init();