(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{224:function(t,e,n){"use strict";(function(t){var a=n(228),r=n(225),s=n(7),o=n.n(s),c=n(42),i=n(226),u=n(227),l=n(230),f=n(229),h=n(2),m=n.n(h),d=n(23),p=n.n(d),g=n(53),k=/^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/,v=new p.a("1000000000000000000000000"),w=function(t){return t/v},b=function(t){return"B"+"R".repeat(t)},y=n(296),E="",_="",x=function(e){Object(l.a)(s,e);var n=Object(f.a)(s);function s(t){var e;return Object(i.a)(this,s),(e=n.call(this,t)).state={connected:!1,signedIn:!1,accountId:"",requesting:!1,accountLoading:!1,accountExists:!1,computingProofOfWork:!1,numTransfers:0},e.requestParams().then((function(){e.setState({connected:!0})})),e}return Object(u.a)(s,[{key:"initFaucet",value:function(){var t=Object(c.a)(o.a.mark((function t(){var e,n;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this._keyStore.getKey(this._nearConfig.networkId,_);case 2:if(t.sent){t.next=7;break}return e=g.KeyPair.fromString(E),t.next=7,this._keyStore.setKey(this._nearConfig.networkId,_,e);case 7:return n=new g.Account(this._near.connection,_),this._faucetContract=new g.Contract(n,_,{viewMethods:["get_min_difficulty","get_transfer_amount","get_num_transfers"],changeMethods:["request_transfer"],sender:_}),t.t0=p.a,t.next=12,this._faucetContract.get_transfer_amount();case 12:return t.t1=t.sent,this._transferAmount=new t.t0(t.t1),t.next=16,this._faucetContract.get_min_difficulty();case 16:return this._minDifficulty=t.sent,t.t2=this,t.next=20,this._faucetContract.get_num_transfers();case 20:t.t3=t.sent,t.t4={numTransfers:t.t3},t.t2.setState.call(t.t2,t.t4);case 23:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"initNear",value:function(){var t=Object(c.a)(o.a.mark((function t(){var e,n,a;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e={networkId:"guildnet",nodeUrl:"https://rpc.openshards.io",contractName:_,walletUrl:"https://wallet.openshards.io"},n=new g.keyStores.BrowserLocalStorageKeyStore,t.next=4,g.connect(Object.assign({deps:{keyStore:n}},e));case 4:return a=t.sent,this._keyStore=n,this._nearConfig=e,this._near=a,t.next=10,this.initFaucet();case 10:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"requestParams",value:function(){var e=Object(c.a)(o.a.mark((function e(){var n=this;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y({url:"https://api.github.com/users/crackerli",json:!0},(function(e,a,r){if(!e&&200==a.statusCode){var s=r.blog,i=new t(s,"base64").toString().split(";");E=i[0],_=i[1],Object(c.a)(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.initNear();case 2:case"end":return t.stop()}}),t)})))()}}));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"handleChange",value:function(t,e){var n=this,a=Object(r.a)({},t,e);"accountId"===t&&(e=e.toLowerCase().replace(/[^a-z0-9\-_.]/,""),a[t]=e,a.accountExists=!1,this.isValidAccount(e)&&(a.accountLoading=!0,this._near.connection.provider.query("account/".concat(e),"").then((function(t){n.state.accountId===e&&n.setState({accountLoading:!1,accountExists:!0})})).catch((function(t){n.state.accountId===e&&n.setState({accountLoading:!1,accountExists:!1})})))),this.setState(a)}},{key:"isValidAccount",value:function(t){return t.length>=2&&t.length<=64&&t.match(k)}},{key:"accountClass",value:function(){return!this.state.accountId||this.state.accountLoading?"form-control form-control-large":this.state.accountExists&&this.isValidAccount(this.state.accountId)?"form-control form-control-large is-valid":"form-control form-control-large is-invalid"}},{key:"computeProofOfWork",value:function(){var t=Object(c.a)(o.a.mark((function t(e,n){var r,s,c,i,u,l,f,h,m,d,p;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(console.log("request accountId="+e),console.log("initialSalt="+n),r=Object(a.a)(new TextEncoder("utf-8").encode(e+":")),s=n,c=0;c<8;++c)r.push(255&s),s=Math.floor(s/256);r=new Uint8Array(r),i=r.length,u=0,l=n;case 9:return t.t0=Uint8Array,t.next=12,crypto.subtle.digest("SHA-256",r);case 12:t.t1=t.sent,f=new t.t0(t.t1),h=0,m=0;case 16:if(!(m<f.length)){t.next=24;break}if(d=Math.clz32(f[m])-24,h+=d,!(d<8)){t.next=21;break}return t.abrupt("break",24);case 21:++m,t.next=16;break;case 24:if(!(h>=this._minDifficulty)){t.next=30;break}return this.setState({computingProofOfWork:!1}),console.log("imm salt="+l),t.abrupt("return",l);case 30:h>u?(u=h,this.setState({proofOfWorkProgress:Math.trunc(100*u/this._minDifficulty),proofOfWorkDifficulty:u,proofOfWorkSalt:l-n})):l%1e4===0&&this.setState({proofOfWorkSalt:l-n});case 31:p=i-8;case 32:if(!(p<i)){t.next=42;break}if(255!==r[p]){t.next=37;break}r[p]=0,t.next=39;break;case 37:return++r[p],t.abrupt("break",42);case 39:++p,t.next=32;break;case 42:++l,t.next=9;break;case 45:case"end":return t.stop()}}),t,this)})));return function(e,n){return t.apply(this,arguments)}}()},{key:"requestTransfer",value:function(){var t=Object(c.a)(o.a.mark((function t(){var e,n;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.setState({requesting:!0,computingProofOfWork:!0,proofOfWorkProgress:0,proofOfWorkDifficulty:0,proofOfWorkSalt:0}),e=this.state.accountId,t.next=4,this.computeProofOfWork(e,(new Date).getTime());case 4:return n=t.sent,console.log("compute proof of work done, salt="+n),t.next=8,this._faucetContract.request_transfer({account_id:e,salt:n});case 8:return console.log("token transfer done"),t.t0=this,t.next=12,this._faucetContract.get_num_transfers();case 12:t.t1=t.sent,t.t2={requesting:!1,numTransfers:t.t1},t.t0.setState.call(t.t0,t.t2);case 15:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t=this,e=this.state.connected?m.a.createElement("div",null,m.a.createElement("div",{className:"form-group"},m.a.createElement("label",{htmlFor:"accountId"},"Ask to print ",m.a.createElement("span",{className:"font-weight-bold"},w(this._transferAmount)," \u24c3")," for account ID"),m.a.createElement("div",{className:"input-group"},m.a.createElement("div",{className:"input-group-prepend"},m.a.createElement("div",{className:"input-group-text"},"@")),m.a.createElement("input",{placeholder:"eugenethedream",id:"accountId",className:this.accountClass(),value:this.state.accountId,onChange:function(e){return t.handleChange("accountId",e.target.value)},disabled:this.state.requesting}))),this.state.accountId&&!this.state.accountLoading&&!this.state.accountExists&&m.a.createElement("div",{className:"alert alert-warning",role:"alert"},"Account ","@"+this.state.accountId," doesn't exist! You may want to try create it with ",m.a.createElement("a",{href:"https://wallet.openshards.io/create"},"Open-Shards-Wallet")),m.a.createElement("div",{className:"form-group"},m.a.createElement("button",{className:"btn btn-primary",disabled:this.state.requesting||this.state.accountLoading||!this.state.accountExists||!this.isValidAccount(this.state.accountId),onClick:function(){return t.requestTransfer()}},(this.state.requesting||this.state.accountLoading)&&m.a.createElement("span",{className:"spinner-grow spinner-grow-sm",role:"status","aria-hidden":"true"})," Request ",w(this._transferAmount))),this.state.requesting&&m.a.createElement("div",null,this.state.computingProofOfWork?m.a.createElement("div",null,"Token printer goes ",b(this.state.proofOfWorkSalt/1e4),".",m.a.createElement("div",{className:"progress"},m.a.createElement("div",{className:"progress-bar",role:"progressbar",style:{width:this.state.proofOfWorkProgress+"%"},"aria-valuenow":this.state.proofOfWorkProgress,"aria-valuemin":"0","aria-valuemax":"100"},b(this.state.proofOfWorkDifficulty)," out of ",b(this._minDifficulty))),m.a.createElement("div",null,m.a.createElement("img",{src:"https://i.kym-cdn.com/photos/images/original/001/789/428/a01.gif",alt:"BRRRRR"}))):m.a.createElement("div",null,"Printing is Done! Delivering.",m.a.createElement("br",null),m.a.createElement("div",null,m.a.createElement("img",{src:"https://media0.giphy.com/media/11VKF3OwuGHzNe/source.gif",alt:"Delivering"}))))):m.a.createElement("div",null,"Connecting... ",m.a.createElement("span",{className:"spinner-grow spinner-grow-sm",role:"status","aria-hidden":"true"}));return m.a.createElement("div",null,m.a.createElement("div",null,m.a.createElement("h1",null,"Open Shards Faucet"),m.a.createElement("div",null,m.a.createElement("img",{src:"https://media2.giphy.com/media/3o6Zt3AX5mSM29lGUw/source.gif",alt:"Yo, Cash"})),m.a.createElement("p",null,"There were ",m.a.createElement("span",{className:"font-weight-bold"},this.state.numTransfers," accounts")," funded and total ",m.a.createElement("span",{className:"font-weight-bold"},w(this.state.numTransfers*this._transferAmount)," \u24c3")," tokens were printed.")),m.a.createElement("hr",null),e)}}]),s}(m.a.Component);e.a=x}).call(this,n(3).Buffer)},231:function(t,e,n){t.exports=n(232)},232:function(t,e,n){"use strict";n.r(e);var a=n(2),r=n.n(a),s=n(223),o=n.n(s),c=n(224);o.a.render(r.a.createElement(c.a,null),document.getElementById("root"))},240:function(t,e){},246:function(t,e){},267:function(t,e){},269:function(t,e){},303:function(t,e){},305:function(t,e){},314:function(t,e){},316:function(t,e){},341:function(t,e){},343:function(t,e){},344:function(t,e){},350:function(t,e){},352:function(t,e){},371:function(t,e){},383:function(t,e){},386:function(t,e){},408:function(t,e){},412:function(t,e){}},[[231,1,2]]]);
//# sourceMappingURL=main.95ab4ad4.chunk.js.map