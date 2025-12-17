// 1. 读取/保存配置
const cfg={ fs:12, hue:120, alpha:0, mirror:false };
Object.assign(cfg, JSON.parse(localStorage.getItem('hudCfg')||'{}'));

// 2. 初次渲染
applyAll();

// 3. 绑定控件
document.getElementById('fontRange').oninput=e=>{ cfg.fs=e.target.value; applyAll(); };
document.getElementById('hueRange').oninput=e=>{ cfg.hue=e.target.value; applyAll(); };
document.getElementById('alphaRange').oninput=e=>{ cfg.alpha=e.target.value; applyAll(); };
document.getElementById('mirrorBtn').onclick=()=>{ cfg.mirror=!cfg.mirror; applyAll(); };

// 4. 点击屏幕显示/隐藏面板
let timer; document.body.onclick=()=>{
  document.body.classList.toggle('showPanel');
  clearTimeout(timer); timer=setTimeout(()=>document.body.classList.remove('showPanel'),3000);
};

// 5. GPS 速度
navigator.geolocation.watchPosition(pos=>{
  const ms=pos.coords.speed ?? 0;        // m/s
  document.getElementById('speed').textContent=(ms*3.6).toFixed(0);
},err=>{}, {enableHighAccuracy:true, timeout:200, maximumAge:200});

// 工具函数
function applyAll(){
  document.documentElement.style.setProperty('--fs', cfg.fs+'vh');
  document.documentElement.style.setProperty('--hue', cfg.hue);
  document.documentElement.style.setProperty('--alpha', cfg.alpha);
  document.body.classList.toggle('mirror', cfg.mirror);
  localStorage.setItem('hudCfg', JSON.stringify(cfg));
}
// 让箭头闪烁（模拟导航激活）
setInterval(()=> turnIcon.style.opacity = Math.sin(Date.now()/300)>0?1:0.3 , 30);

// 距离倒计时
let dist=300;
setInterval(()=> { dist-=5; if(dist<0)dist=300; distance.textContent=dist+' m'; }, 500);

// 转速条 0-8000 rpm 假数据
let rpm=0, dir=1;
setInterval(()=>{
  rpm+=dir*150; if(rpm>8000){rpm=8000; dir=-1;} if(rpm<0){rpm=0; dir=1;}
  const pct=rpm/8000;                                // 0-1
  const offset=565.5*(1-pct);                        // 565.5=2πr
  rpmBar.style.strokeDashoffset=offset;
  rpmBar.parentElement.querySelector('.rpm-text').textContent=Math.round(rpm);
}, 100);