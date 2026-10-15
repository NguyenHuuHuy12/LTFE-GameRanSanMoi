$(function (){
    function khoi(x1,y1,x2,y2){
        var kq=[];
        for(var y = y1; y <= y2; y++){
            for (var x = x1; x <= x2; x++){
                kq.push([x,y]);
            }
        }
        return kq;
    }
    var Cacman = [
        {
            ten:'Khởi đầu của rắn',
            cot:30, hang:25, mili:300,dai:3,muc:10,
            tuong:khoi(5,2,5,7).concat(khoi(5,11,5,16), khoi(15,2,15,7), khoi(15,11,15,16), khoi(10,3,10,5)),
            mau:{nen1:'#262a33',nen2:'#2b303a',tuong:'#6f7787',ran:'#7be'},
            truyen:'trong cơn mưa lớn rắn nở ra giữa dãy núi nhiều yêu thú rắn phải nhanh chóng mạnh lên và bài học đầu đời là kiếm ăn',
            ketthuc:'rắn đã học được cách kiếm ăn và chuẩn bị đối diện với những thử thách lớn của đời rắn'
        }
    ]
    var $ban = $('#ban');
    var #modal = $('#modal');

    var man =0;
    var diem=0;
    var diemDauMan=0;
    var moiAn=0;
    var kyLuc=0;

    var ran=[];
    var huong={x:1,y:0};
    var hangDoi=[];
    var moi=null;
    var mapTuong={};
    
    var dsO=[];
    var oDaTo = [];
    var oMoi =null;
    var coO=24;
    
    var timer = null;
    var dangChoi = false;
    var tamDung = false;

    try{
        kyLuc= parseInt(localStorage.getItem("kyLuc"), 10)||0;
    } catch (e){
        kyLuc=0;
    }
    $('#kyluc').text(kyLuc);
    $('#tongman').text(Cacman.length)

    function chuanHoa(giaTri, nho, lon) {
        if(lon == nho)
            return 0;
        return (giaTri - nho)/(lon-nho);

    }
    function tinhDoKho(i) {
        var m =Cacman[i];
        var dau =Cacman[0];
        var cuoi = Cacman[Cacman.length-1];
        var tocDo = chuanHoa(dau.mili - m.mili, 0, dau.mili -cuoi.mili);
        var san = chuanHoa(m.cot*m.hang, dau.cot*dau.hang, cuoi.cot*cuoi.hang);
        var dai = chuanHoa(m.dai,dau.dai,cuoi.dai);
        var tuong = chuanHoa(m.tuong.length, 0, cuoi.tuong.length);
        var tong = 0.4 * tocDo+0.25*san+0.2*dai + 0.15*tuong;
        return Math.round(10+tong*90);

    }
    function hienHop(tieuDe, noiDung,thongSo,chuNut,khiBam) {
        dangChoi = false;

        $('#mp-tieu-de').text(tieuDe);
        $('#mp-noi-dung').text(noiDung);

        var $ts = $('#mp-thong-so').empty();
        if(thongSo){
            for (var i = 0; i < thongSo.length; i++){
                $ts.append('<span class = "badge badge-pill">'+ thongSo[i] +'</span>');
            }
        }
        $('#mp-nut').text(chuNut).prop('disabled', false).off('click').on('click', function (){
            $(this).prop('disabled', true);
           $modal.one('hidden.bs.modal', khiBam).modal('hide');
        });
        $modal.modal('show');

    }
    $modal.on('hidden.bs.modal', function (){
        $('#mp-nut').trigger('focus')
    });
    function thongSoMan(i) {
        var m=Cacman[i];
        return[
            'Toc do: <b>'+Math.round(10000/m.mili)/10+'o</b>',
            'San: <b>'+m.cot+'x'+m.hang+'</b>',
            'Ran: <b>'+m.dai+'dot</b>',
            'Muc tieu:<b>'+m.muc+'tao</b>',
            'Do kho:<b>'+tinhDoKho(i)+'%</b>'
        ];

    }
    function hienCotTruyen() {
        var m =Cacman[man];
        dungSan();
        hienHop('Man'+(man+1)+':'+m.ten,m.truyen,thongSoMan(man),'Bat dau',batDauMan);
    }
    function lay0(x,y) {
        return dsO[y*man[man].cot+x];
        
    }
    function tinhCoO() {
        var m =Cacman[man];
        var rong = $('#khung-ban').width()-14;
        var cao =$(window).height()-230;
        if($(window).width()<768) cao-=90;
        coO = Math.floor(Math.min(rong/m.cot, cao/m.hang, 30));
        if(coO<10) coO=10;
        $ban.css({
            '--o': coO+'px',
            'grid-template-colums': 'repeat(' +m.cot+','+coO+'px)'
        });
        
    }
    function dungSan() {
        var m =Cacman[man];
        var html ='';
        var x,y,i;
        
        for (y=0;y<m.hang;y++){
            for(x=0;x<m.cot;x++){
                html += '<div class="o' +(((x+y)%2 ===0)? 'chan' :'le')+'"></div>';
                
            }
        }
        $ban.html(html).removeClass('thua');
        dsO =$ban.children().toArray();
        oDaTo=[];
        oMoi = null;
        
        $ban.css({
            '--nen1': m.mau.nen1,
            '--nen2': m.mau.nen2,
            '--tuong': m.mau.tuong,
            '--ran': m.mau.ran,
        });
        tinhCoO();
        mapTuong ={};
        for (i=0;i<m.tuong.length;i++){
            var tx = m.tuong[i][0];
            var ty = m.tuong[i][1];
            mapTuong[tx +','+ty] =true;
            lay0(tx,ty).classList.add('tuong');
        }
        
    }
    function batDauMan() {
        var m =Cacman[man];
        clearTimeout(timer);
        tamDung =false;
        $('#nut-dung i').attr('class', 'fa-solid -fa-pause');
        dungSan();
        var gx =Math.floor(m.cot/2);
        var gy =Math.floor(m.hang/2);
        ran=[];
        for (var j=0 ; j<m.dai; j++){
            ran.push({x: gx-j, y: gy})
        }
        huong ={x:1,y:0};
        hangDoi=[];
        moiAn=0;
        diem=diemDauMan;
        capNhatHub();
        sinhMoi();
        ve();

        dangChoi = true;
        timer = setTimeout(buocDi,700);
    }
    function capNhatHub() {
        var m =Cacman[man];
        var dk = tinhDoKho(man);

        $('#soman').text(man+1);
        $('#somoi').text(moiAn);
        $('#muc-tieu').text(m.muc);
        $('#diem').text(diem);
        $('#kyluc').text(kyLuc);
        $('#so-do-kho').text(dk+'%');
        $('#vach-do-kho').css('width',dk+'%').removeClass('bg-success bg-warning bg-danger').addClass(dk<40? 'bg-success':(dk<70? 'bg-warning':'bg-danger'));

    }
    function sinhMoi() {
        var m =Cacman[man];
        var trong = [];

        for(var y=0;y<m.hang;y++){
            for(var x=0;x<m.cot;x++){
                if(mapTuong[x+','+y]) continue;
                var trung=false;
                for(var k=0;k<ran.length;k++){
                    if(ran[k].x===x && ran[k].y===y){
                        trung=true;
                        break;
                    }
                    if(!trung) trong.push({x:x,y:y});
                }
            }
        }
            moi=trong[Math.floor(Math.random()*trong.length)];
            if(oMoi) oMoi.classList.remove('moi');
            oMoi = lay0(moi.x,moi.y);
            oMoi.classList.add('moi');

    }
    function buocDi() {
        if(!dangChoi || tamDung)
            return;
        if(hangDoi.length>0){
            huong = hangDoi.shift();
        }
        var dau =ran[0];
        var dauMoi={x:dau.x+huong.x,y:dau.y+huong.y};
        if(vaCham(dauMoi)){
            thuaMan();
            return;
        }
        ran.unshift(dauMoi);
        if(dauMoi.x===moi.x && dauMoi.y===moi.y){
            moiAn++;
            diem += 10*(man+1);
            if(diem>kyLuc){
                kyLuc=diem;
                try {
                    localStorage.setItem("kyLuc", kyLuc);
                }
                catch (e) {

                }}
                capNhatHub();
                if(moiAn>= Cacman[man].muc){
                    ve();
                    thangMan();
                    return;
                }
                sinhMoi();
            } else {
                ran.pop();
            }
            ve();
            timer = setTimeout(buocDi, Cacman[man].mili);

    }

    function vaCham(p) {
        var m = Cacman[man];

        if (p.x < 0 || p.y < 0 || p.x >= m.cot || p.y >= m.hang)
            return true;
        if (mapTuong[p.x + ',' + p.y])
            return true;

        for (var i = 0; i < ran.length - 1; i++) {
            if (ran[i].x === p.x && ran[i].y === p.y)
                return true;
        }
        return false;
    }

    function thangMan() {
        dangChoi = false;
        clearTimeout(timer);

        var m = Cacman[man];

        if (man === Cacman.length - 1) {
            hienHop('Ran hoa Rong', m.ketThuc, ['Tổng điểm: <b>' + diem + '</b>'], 'Chơi lại từ đầu', function () {
                man = 0;
                diem = 0;
                diemDauMan = 0;
                hienCotTruyen();
            });
        } else {
            hienHop('Hoàn thành màn ' + (man + 1), m.ketThuc, ['Điểm: <b>' + diem + '</b>'], 'Màn tiếp theo', function () {
                man++;
                diemDauMan = diem;
                hienCotTruyen();
            });
        }
    }
    function thuaMan() {
        dangChoi = false;
        clearTimeout(timer);
        $ban.addClass('thua');

        var moiDaAn = moiAn;
        var muc = Cacman[man].muc;

        setTimeout(function () {
            hienHop('Ran ngã rồi', 'Rắn đã đâm vào chướng ngại. Hít một hơi và thử lại màn này nhé.', ['Đã ăn: <b>' + moiDaAn + '/' + muc + '</b>'], 'Chơi lại màn', function () {
                diem = diemDauMan;
                batDauMan();
            });
        }, 450);
    }
    var TEN_HUONG = ['h-len', 'h-xuong', 'h-trai', 'h-phai'];

    function tenHuong() {
        if (huong.x === 1) return 'h-phai';
        if (huong.x === -1) return 'h-trai';
        if (huong.y === -1) return 'h-len';
        return 'h-xuong';
    }
    function ve() {
        var i, el;

        for (i = 0; i < oDaTo.length; i++) {
            el = oDaTo[i];
            el.classList.remove('ran', 'dau', TEN_HUONG[0], TEN_HUONG[1], TEN_HUONG[2], TEN_HUONG[3]);
            el.style.removeProperty('--dd');
        }
        oDaTo = [];

        for (i = 0; i < ran.length; i++) {
            el = lay0(ran[i].x, ran[i].y);
            el.classList.add('ran');
            el.style.setProperty('--dd', (0.55 + 0.45 * (1 - i / ran.length)).toFixed(2));
            oDaTo.push(el);
        }

        el = lay0(ran[0].x, ran[0].y);
        el.classList.add('dau', tenHuong());
    }
    function doiHuong(dx, dy) {
        if (!dangChoi || tamDung)
            return;

        var cuoi = hangDoi.length > 0 ? hangDoi[hangDoi.length - 1] : huong;
        if (cuoi.x === -dx && cuoi.y === -dy)
            return;
        if (cuoi.x === dx && cuoi.y === dy)
            return;
        if (hangDoi.length < 2) {
            hangDoi.push({ x: dx, y: dy });
        }
    }

    function doiTamDung() {
        if (!dangChoi)
            return;

        tamDung = !tamDung;
        if (tamDung) {
            clearTimeout(timer);
            $('#nut-tam-dung i').attr('class', 'fa-solid fa-play');
        } else {
            $('#nut-tam-dung i').attr('class', 'fa-solid fa-pause');
            timer = setTimeout(buocDi, Cacman[man].mili);
        }
    }

    $(document).on('keydown', function (e) {
        var k = e.key;
        if (k === 'ArrowUp' || k === 'w' || k === 'W') { doiHuong(0, -1); e.preventDefault(); }
        else if (k === 'ArrowDown' || k === 's' || k === 'S') { doiHuong(0, 1); e.preventDefault(); }
        else if (k === 'ArrowLeft' || k === 'a' || k === 'A') { doiHuong(-1, 0); e.preventDefault(); }
        else if (k === 'ArrowRight' || k === 'd' || k === 'D') { doiHuong(1, 0); e.preventDefault(); }
        else if ((k === ' ' || k === 'p' || k === 'P') && dangChoi) { doiTamDung(); e.preventDefault(); }
    });

    $('#nut-tam-dung').on('click', function () {
        doiTamDung();
        $(this).trigger('blur');
    });

    $('.phim-dt .btn').on('click', function () {
        var h = $(this).data('h');
        if (h === 'len') doiHuong(0, -1);
        if (h === 'xuong') doiHuong(0, 1);
        if (h === 'trai') doiHuong(-1, 0);
        if (h === 'phai') doiHuong(1, 0);
        $(this).trigger('blur');
    });

    var chamX = 0;
    var chamY = 0;
    var ban = document.getElementById('ban');

    ban.addEventListener('touchstart', function (e) {
        chamX = e.touches[0].clientX;
        chamY = e.touches[0].clientY;
    }, { passive: true });

    ban.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - chamX;
        var dy = e.changedTouches[0].clientY - chamY;
        if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            doiHuong(dx > 0 ? 1 : -1, 0);
        } else {
            doiHuong(0, dy > 0 ? 1 : -1);
        }
    }, { passive: true });

    $(window).on('resize', tinhCoO);

    hienCotTruyen();

});