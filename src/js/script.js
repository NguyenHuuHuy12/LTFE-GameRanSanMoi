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
            cot:30, hang:25, mili:300,dai:3,muc:10, batdau:{x:9,y:12},
            tuong:khoi(5,2,5,7).concat(khoi(5,11,5,16), khoi(15,2,15,7), khoi(15,11,15,16), khoi(10,3,10,5)),
            mau:{nen1:'#262a33',nen2:'#2b303a',tuong:'#6f7787',ran:'#7be'},
            truyen:'trong cơn mưa lớn rắn nở ra giữa dãy núi nhiều yêu thú rắn phải nhanh chóng mạnh lên và bài học đầu đời là kiếm ăn',
            ketthuc:'rắn đã học được cách kiếm ăn và chuẩn bị đối diện với những thử thách lớn của đời rắn'
        },
        {
            ten:'Đất rung chuyển',
            cot:45, hang:38, mili:260,dai:3,muc:15, batdau:{x:9,y:19}, tuongNoi:true,
            tuong:khoi(8,4,8,10).concat(khoi(8,28,8,34), khoi(22,4,22,12), khoi(22,26,22,34), khoi(34,8,34,16), khoi(34,22,34,30), khoi(14,15,18,15), khoi(26,23,30,23)),
            mau:{nen1:'#33281f',nen2:'#3a2f25',tuong:'#8a6a4a',ran:'#e8a85c'},
            truyen:'rắn lớn lên và tìm đến một vùng đất rộng hơn nhưng mặt đất ở đây không yên tĩnh những bức tường đá thỉnh thoảng trồi lên từ lòng đất chắn ngang đường đi',
            ketthuc:'rắn đã quen với mặt đất rung chuyển và biết nhìn trước những nơi đá sắp trồi lên'
        },
        {
            ten:'Cơn thịnh nộ của sét',
            cot:45, hang:38, mili:260,dai:3,muc:20, batdau:{x:9,y:19}, set:{chuKy:2000,soTia:3},
            tuong:khoi(8,4,8,10).concat(khoi(8,28,8,34), khoi(22,4,22,12), khoi(22,26,22,34), khoi(34,8,34,16), khoi(34,22,34,30), khoi(14,15,18,15), khoi(26,23,30,23)),
            mau:{nen1:'#1b1f3a',nen2:'#20254a',tuong:'#5a5f8f',ran:'#7ef0ff'},
            truyen:'bầu trời tối sầm lại sét liên tục giáng xuống sân đấu rắn phải vừa kiếm ăn vừa tránh những tia sét có thể cướp đi thành quả của mình',
            ketthuc:'rắn đã vượt qua cơn bão sét nhưng phía trước vẫn còn lửa từ lòng đất'
        },
        {
            ten:'Núi lửa thức giấc',
            cot:45, hang:38, mili:260,dai:3,muc:25, batdau:{x:22,y:19}, nuiLua:{chuKy:5000,soNui:4,soCuc:5},
            tuong:khoi(8,6,8,12).concat(khoi(8,26,8,32), khoi(16,10,22,10), khoi(16,28,22,28), khoi(26,4,26,9), khoi(26,29,26,34), khoi(36,10,36,16), khoi(36,22,36,28), khoi(30,18,34,18), khoi(40,14,40,16)),
            nui:khoi(0,0,1,1).concat(khoi(43,0,44,1), khoi(0,36,1,37), khoi(43,36,44,37)),
            mau:{nen1:'#2a1612',nen2:'#321b16',tuong:'#6b5047',ran:'#ffd24a'},
            truyen:'rắn đi đến miền đất cuối cùng nơi bốn ngọn núi lửa ở bốn góc sân đã thức giấc dung nham văng ra khắp nơi chạm vào là bỏng và khi nguội sẽ hóa thành đá chắn đường',
            ketthuc:'rắn đã vượt qua lửa sét và đất rung chuyển rắn hóa thành rồng'
        }
    ]
    var $ban = $('#ban');
    var $modal = $('#modal-truyen');

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

    var thoiGian = 0;
    var tgTuongTiep = 3000;
    var tgSetTiep = 3000;
    var dsTuongNoi = [];
    var mapChop = {};
    var dsSet = [];
    var xoaSetLuc = 0;
    var dsDungNham = [];
    var mapDung = {};
    var dsNui = [];
    var tgNuiTiep = 5000;
    var xoaPhunLuc = 0;

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
            'Tốc độ: <b>'+Math.round(10000/m.mili)/10+' ô/giây</b>',
            'Sân: <b>'+m.cot+'x'+m.hang+'</b>',
            'Rắn: <b>'+m.dai+' đốt</b>',
            'Mục tiêu: <b>'+m.muc+' táo</b>',
            'Độ khó: <b>'+tinhDoKho(i)+'%</b>'
        ];

    }
    function hienCotTruyen() {
        var m =Cacman[man];
        dungSan();
        hienHop('Màn '+(man+1)+': '+m.ten,m.truyen,thongSoMan(man),'Bắt đầu',batDauMan);
    }
    function lay0(x,y) {
        return dsO[y*Cacman[man].cot+x];

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
            'grid-template-columns': 'repeat(' +m.cot+','+coO+'px)'
        });

    }
    function dungSan() {
        var m =Cacman[man];
        var html ='';
        var x,y,i;

        for (y=0;y<m.hang;y++){
            for(x=0;x<m.cot;x++){
                html += '<div class="o ' +(((x+y)%2 ===0)? 'chan' :'le')+'"></div>';

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
        dsNui=[];
        if(m.nui){
            for (i=0;i<m.nui.length;i++){
                var nx = m.nui[i][0];
                var ny = m.nui[i][1];
                mapTuong[nx +','+ny] =true;
                lay0(nx,ny).classList.add('nui');
                dsNui.push(lay0(nx,ny));
            }
        }

    }
    function batDauMan() {
        var m =Cacman[man];
        clearTimeout(timer);
        tamDung =false;
        $('#nut-dung i').attr('class', 'fa-solid fa-pause');
        dungSan();
        thoiGian=0;
        tgTuongTiep=3000;
        tgSetTiep= m.set ? m.set.chuKy : 3000;
        dsTuongNoi=[];
        mapChop={};
        dsSet=[];
        xoaSetLuc=0;
        dsDungNham=[];
        mapDung={};
        tgNuiTiep= m.nuiLua ? m.nuiLua.chuKy : 5000;
        xoaPhunLuc=0;
        var gx = m.batdau ? m.batdau.x : Math.floor(m.cot/2);
        var gy = m.batdau ? m.batdau.y : Math.floor(m.hang/2);
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
        $('#tongsomoi').text(m.muc);
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
                if(mapTuong[x+','+y] || mapChop[x+','+y] || mapDung[x+','+y]) continue;
                var trung=false;
                for(var k=0;k<ran.length;k++){
                    if(ran[k].x===x && ran[k].y===y){
                        trung=true;
                        break;
                    }
                }
                if(!trung) trong.push({x:x,y:y});
            }
        }
        moi=trong[Math.floor(Math.random()*trong.length)];
        if(oMoi) oMoi.classList.remove('moi');
        oMoi = lay0(moi.x,moi.y);
        oMoi.classList.add('moi');

    }
    function trungRan(x,y) {
        for(var k=0;k<ran.length;k++){
            if(ran[k].x===x && ran[k].y===y)
                return true;
        }
        return false;
    }
    function sinhTuongNoi() {
        var m =Cacman[man];
        for(var lan=0;lan<50;lan++){
            var ngang = Math.random()<0.5;
            var x = Math.floor(Math.random()*(m.cot-(ngang? 3:0)));
            var y = Math.floor(Math.random()*(m.hang-(ngang? 0:3)));
            var cacO = [];
            var tot = true;
            for(var k=0;k<4;k++){
                var cx = ngang? x+k : x;
                var cy = ngang? y : y+k;
                if(mapTuong[cx+','+cy] || mapChop[cx+','+cy] || trungRan(cx,cy) || (moi.x===cx && moi.y===cy)){
                    tot=false;
                    break;
                }
                cacO.push({x:cx,y:cy});
            }
            if(tot){
                for(var j=0;j<cacO.length;j++){
                    mapChop[cacO[j].x+','+cacO[j].y]=true;
                    lay0(cacO[j].x,cacO[j].y).classList.add('chop');
                }
                dsTuongNoi.push({cacO:cacO, gd:0, luc:thoiGian+1000});
                return;
            }
        }
    }
    function capNhatTuongNoi() {
        var i,j,t,o,k,coVat;
        if(thoiGian>=tgTuongTiep){
            tgTuongTiep+=3000;
            sinhTuongNoi();
        }
        for(i=dsTuongNoi.length-1;i>=0;i--){
            t=dsTuongNoi[i];
            if(thoiGian<t.luc) continue;
            if(t.gd===0){
                coVat=false;
                for(j=0;j<t.cacO.length;j++){
                    o=t.cacO[j];
                    if(trungRan(o.x,o.y) || (moi.x===o.x && moi.y===o.y))
                        coVat=true;
                }
                for(j=0;j<t.cacO.length;j++){
                    o=t.cacO[j];
                    k=o.x+','+o.y;
                    delete mapChop[k];
                    lay0(o.x,o.y).classList.remove('chop');
                    if(!coVat){
                        mapTuong[k]=true;
                        lay0(o.x,o.y).classList.add('tuong');
                    }
                }
                if(coVat){
                    dsTuongNoi.splice(i,1);
                } else {
                    t.gd=1;
                    t.luc=thoiGian+5000;
                }
            } else {
                for(j=0;j<t.cacO.length;j++){
                    o=t.cacO[j];
                    delete mapTuong[o.x+','+o.y];
                    lay0(o.x,o.y).classList.remove('tuong');
                }
                dsTuongNoi.splice(i,1);
            }
        }
    }
    function capNhatSet() {
        var m =Cacman[man];
        var i,sx,sy,o;
        if(dsSet.length>0 && thoiGian>=xoaSetLuc){
            for(i=0;i<dsSet.length;i++){
                dsSet[i].classList.remove('set');
            }
            dsSet=[];
        }
        if(thoiGian>=tgSetTiep){
            tgSetTiep+=m.set.chuKy;
            for(i=0;i<dsSet.length;i++){
                dsSet[i].classList.remove('set');
            }
            dsSet=[];
            xoaSetLuc = thoiGian+400;
            for(i=0;i<m.set.soTia;i++){
                sx = Math.floor(Math.random()*m.cot);
                sy = Math.floor(Math.random()*m.hang);
                o = lay0(sx,sy);
                o.classList.add('set');
                dsSet.push(o);
                if(trungRan(sx,sy)){
                    if(moiAn===0){
                        thuaMan('Rắn bị sét đánh khi chưa còn quả nào. Hít một hơi và thử lại màn này nhé.');
                        return;
                    }
                    moiAn--;
                    capNhatHub();
                }
            }
        }
    }
    function chayRan() {
        if(moiAn<2){
            thuaMan('Rắn bị dung nham thiêu cháy khi chỉ còn dưới 2 quả. Hít một hơi và thử lại màn này nhé.');
            return;
        }
        moiAn-=2;
        capNhatHub();
    }
    function capNhatNuiLua() {
        var m =Cacman[man];
        var i,t,k,o,x,y,lan;
        var dau =ran[0];
        if(mapDung[dau.x+','+dau.y]){
            chayRan();
            if(!dangChoi) return;
        }
        if(dsNui.length>0 && thoiGian>=xoaPhunLuc){
            for(i=0;i<dsNui.length;i++){
                dsNui[i].classList.remove('phun');
            }
        }
        if(thoiGian>=tgNuiTiep){
            tgNuiTiep+=m.nuiLua.chuKy;
            for(i=0;i<dsNui.length;i++){
                dsNui[i].classList.add('phun');
            }
            xoaPhunLuc = thoiGian+500;
            for(i=0;i<m.nuiLua.soNui*m.nuiLua.soCuc;i++){
                for(lan=0;lan<30;lan++){
                    x = Math.floor(Math.random()*m.cot);
                    y = Math.floor(Math.random()*m.hang);
                    k = x+','+y;
                    if(mapTuong[k] || mapDung[k] || (moi.x===x && moi.y===y)) continue;
                    mapDung[k]=true;
                    lay0(x,y).classList.add('dungnham');
                    dsDungNham.push({x:x,y:y,gd:0,luc:thoiGian+3000});
                    if(trungRan(x,y)){
                        chayRan();
                        if(!dangChoi) return;
                    }
                    break;
                }
            }
        }
        for(i=dsDungNham.length-1;i>=0;i--){
            t=dsDungNham[i];
            if(thoiGian<t.luc) continue;
            k=t.x+','+t.y;
            o=lay0(t.x,t.y);
            if(t.gd===0){
                delete mapDung[k];
                o.classList.remove('dungnham');
                if(trungRan(t.x,t.y) || (moi.x===t.x && moi.y===t.y)){
                    dsDungNham.splice(i,1);
                } else {
                    mapTuong[k]=true;
                    o.classList.add('tuong');
                    t.gd=1;
                    t.luc=thoiGian+5000;
                }
            } else {
                delete mapTuong[k];
                o.classList.remove('tuong');
                dsDungNham.splice(i,1);
            }
        }
    }
    function capNhatNguyHiem() {
        var m =Cacman[man];
        thoiGian+=m.mili;
        if(m.tuongNoi) capNhatTuongNoi();
        if(m.set) capNhatSet();
        if(m.nuiLua) capNhatNuiLua();
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
        capNhatNguyHiem();
        if(!dangChoi)
            return;
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
            hienHop('Rắn hóa Rồng', m.ketthuc, ['Tổng điểm: <b>' + diem + '</b>'], 'Chơi lại từ đầu', function () {
                man = 0;
                diem = 0;
                diemDauMan = 0;
                hienCotTruyen();
            });
        } else {
            hienHop('Hoàn thành màn ' + (man + 1), m.ketthuc, ['Điểm: <b>' + diem + '</b>'], 'Màn tiếp theo', function () {
                man++;
                diemDauMan = diem;
                hienCotTruyen();
            });
        }
    }
    function thuaMan(lyDo) {
        dangChoi = false;
        clearTimeout(timer);
        $ban.addClass('thua');

        var moiDaAn = moiAn;
        var muc = Cacman[man].muc;

        setTimeout(function () {
            hienHop('Rắn ngã rồi', lyDo || 'Rắn đã đâm vào chướng ngại. Hít một hơi và thử lại màn này nhé.', ['Đã ăn: <b>' + moiDaAn + '/' + muc + '</b>'], 'Chơi lại màn', function () {
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
            $('#nut-dung i').attr('class', 'fa-solid fa-play');
        } else {
            $('#nut-dung i').attr('class', 'fa-solid fa-pause');
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

    function quaMan() {
        if (!dangChoi)
            return;

        clearTimeout(timer);
        if (man < Cacman.length - 1) {
            man++;
            diemDauMan = diem;
            hienCotTruyen();
        } else {
            thangMan();
        }
    }

    $('#nut-qua-man').on('click', function () {
        quaMan();
        $(this).trigger('blur');
    });

    $('#nut-dung').on('click', function () {
        doiTamDung();
        $(this).trigger('blur');
    });

    $('.phim-di-chuyen .btn').on('click', function () {
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