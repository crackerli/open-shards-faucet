(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{205:function(t,e,n){t.exports=n(470)},211:function(t,e){},217:function(t,e){},240:function(t,e){},242:function(t,e){},304:function(t,e){},306:function(t,e){},307:function(t,e){},313:function(t,e){},315:function(t,e){},333:function(t,e){},336:function(t,e){},352:function(t,e){},355:function(t,e){},377:function(t,e){},470:function(t,e,n){"use strict";n.r(e);var a=n(2),r=n.n(a),s=n(198),o=n.n(s),c=n(202),i=n(199),u=n(7),l=n.n(u),f=n(61),h=n(200),d=n(201),m=n(204),p=n(203),g=n(31),k=n.n(g),v=n(46),w="viboracecata.guildnet",E=/^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/,b=new k.a("1000000000000000000000000"),_=function(t){return t/b},y=function(t){return"B"+"R".repeat(t)},x=n(270),O=function(t){Object(m.a)(n,t);var e=Object(p.a)(n);function n(t){var a;return Object(h.a)(this,n),(a=e.call(this,t)).state={connected:!1,signedIn:!1,accountId:"",requesting:!1,accountLoading:!1,accountExists:!1,computingProofOfWork:!1,numTransfers:0},a.initNear().then((function(){a.setState({connected:!0})})),a}return Object(d.a)(n,[{key:"initFaucet",value:function(){var t=Object(f.a)(l.a.mark((function t(){var e,n;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return x("https://www.google.com",(function(t,e,n){t||200!=e.statusCode||console.log(n)})),t.next=3,this._keyStore.getKey(this._nearConfig.networkId,w);case 3:if(t.sent){t.next=8;break}return e=v.KeyPair.fromString("ed25519:3D2DJcjtv3nFhHsiELeUhUaSFaCQXdJfZqaUcoaHxrGrcNfFs48fbAtbu7i3KdLDaDvMupXzrSjKiWdqqWgnacdc"),t.next=8,this._keyStore.setKey(this._nearConfig.networkId,w,e);case 8:return n=new v.Account(this._near.connection,w),this._faucetContract=new v.Contract(n,w,{viewMethods:["get_min_difficulty","get_transfer_amount","get_num_transfers"],changeMethods:["request_transfer"],sender:w}),t.t0=k.a,t.next=13,this._faucetContract.get_transfer_amount();case 13:return t.t1=t.sent,this._transferAmount=new t.t0(t.t1),t.next=17,this._faucetContract.get_min_difficulty();case 17:return this._minDifficulty=t.sent,t.t2=this,t.next=21,this._faucetContract.get_num_transfers();case 21:t.t3=t.sent,t.t4={numTransfers:t.t3},t.t2.setState.call(t.t2,t.t4);case 24:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"initNear",value:function(){var t=Object(f.a)(l.a.mark((function t(){var e,n,a;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e={networkId:"guildnet",nodeUrl:"https://rpc.openshards.io",contractName:w,walletUrl:"https://wallet.openshards.io"},n=new v.keyStores.BrowserLocalStorageKeyStore,t.next=4,v.connect(Object.assign({deps:{keyStore:n}},e));case 4:return a=t.sent,this._keyStore=n,this._nearConfig=e,this._near=a,t.next=10,this.initFaucet();case 10:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"handleChange",value:function(t,e){var n=this,a=Object(i.a)({},t,e);"accountId"===t&&(e=e.toLowerCase().replace(/[^a-z0-9\-_.]/,""),a[t]=e,a.accountExists=!1,this.isValidAccount(e)&&(a.accountLoading=!0,this._near.connection.provider.query("account/".concat(e),"").then((function(t){n.state.accountId===e&&n.setState({accountLoading:!1,accountExists:!0})})).catch((function(t){n.state.accountId===e&&n.setState({accountLoading:!1,accountExists:!1})})))),this.setState(a)}},{key:"isValidAccount",value:function(t){return t.length>=2&&t.length<=64&&t.match(E)}},{key:"accountClass",value:function(){return!this.state.accountId||this.state.accountLoading?"form-control form-control-large":this.state.accountExists&&this.isValidAccount(this.state.accountId)?"form-control form-control-large is-valid":"form-control form-control-large is-invalid"}},{key:"computeProofOfWork",value:function(){var t=Object(f.a)(l.a.mark((function t(e,n){var a,r,s,o,i,u,f,h,d,m,p;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(console.log("request accountId="+e),console.log("initialSalt="+n),a=Object(c.a)(new TextEncoder("utf-8").encode(e+":")),r=n,s=0;s<8;++s)a.push(255&r),r=Math.floor(r/256);a=new Uint8Array(a),o=a.length,i=0,u=n;case 9:return t.t0=Uint8Array,t.next=12,crypto.subtle.digest("SHA-256",a);case 12:t.t1=t.sent,f=new t.t0(t.t1),h=0,d=0;case 16:if(!(d<f.length)){t.next=24;break}if(m=Math.clz32(f[d])-24,h+=m,!(m<8)){t.next=21;break}return t.abrupt("break",24);case 21:++d,t.next=16;break;case 24:if(!(h>=this._minDifficulty)){t.next=30;break}return this.setState({computingProofOfWork:!1}),console.log("imm salt="+u),t.abrupt("return",u);case 30:h>i?(i=h,this.setState({proofOfWorkProgress:Math.trunc(100*i/this._minDifficulty),proofOfWorkDifficulty:i,proofOfWorkSalt:u-n})):u%1e4===0&&this.setState({proofOfWorkSalt:u-n});case 31:p=o-8;case 32:if(!(p<o)){t.next=42;break}if(255!==a[p]){t.next=37;break}a[p]=0,t.next=39;break;case 37:return++a[p],t.abrupt("break",42);case 39:++p,t.next=32;break;case 42:++u,t.next=9;break;case 45:case"end":return t.stop()}}),t,this)})));return function(e,n){return t.apply(this,arguments)}}()},{key:"requestTransfer",value:function(){var t=Object(f.a)(l.a.mark((function t(){var e,n;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.setState({requesting:!0,computingProofOfWork:!0,proofOfWorkProgress:0,proofOfWorkDifficulty:0,proofOfWorkSalt:0}),e=this.state.accountId,t.next=4,this.computeProofOfWork(e,(new Date).getTime());case 4:return n=t.sent,console.log("compute proof of work done, salt="+n),t.next=8,this._faucetContract.request_transfer({account_id:e,salt:n});case 8:return console.log("token transfer done"),t.t0=this,t.next=12,this._faucetContract.get_num_transfers();case 12:t.t1=t.sent,t.t2={requesting:!1,numTransfers:t.t1},t.t0.setState.call(t.t0,t.t2);case 15:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t=this,e=this.state.connected?r.a.createElement("div",null,r.a.createElement("div",{className:"form-group"},r.a.createElement("label",{htmlFor:"accountId"},"Ask to print ",r.a.createElement("span",{className:"font-weight-bold"},_(this._transferAmount)," \u24c3")," for account ID"),r.a.createElement("div",{className:"input-group"},r.a.createElement("div",{className:"input-group-prepend"},r.a.createElement("div",{className:"input-group-text"},"@")),r.a.createElement("input",{placeholder:"eugenethedream",id:"accountId",className:this.accountClass(),value:this.state.accountId,onChange:function(e){return t.handleChange("accountId",e.target.value)},disabled:this.state.requesting}))),this.state.accountId&&!this.state.accountLoading&&!this.state.accountExists&&r.a.createElement("div",{className:"alert alert-warning",role:"alert"},"Account ","@"+this.state.accountId," doesn't exist! You may want to try create it with ",r.a.createElement("a",{href:"https://wallet.openshards.io/create"},"Open-Shards-Wallet")),r.a.createElement("div",{className:"form-group"},r.a.createElement("button",{className:"btn btn-primary",disabled:this.state.requesting||this.state.accountLoading||!this.state.accountExists||!this.isValidAccount(this.state.accountId),onClick:function(){return t.requestTransfer()}},(this.state.requesting||this.state.accountLoading)&&r.a.createElement("span",{className:"spinner-grow spinner-grow-sm",role:"status","aria-hidden":"true"})," Request ",_(this._transferAmount))),this.state.requesting&&r.a.createElement("div",null,this.state.computingProofOfWork?r.a.createElement("div",null,"Token printer goes ",y(this.state.proofOfWorkSalt/1e4),".",r.a.createElement("div",{className:"progress"},r.a.createElement("div",{className:"progress-bar",role:"progressbar",style:{width:this.state.proofOfWorkProgress+"%"},"aria-valuenow":this.state.proofOfWorkProgress,"aria-valuemin":"0","aria-valuemax":"100"},y(this.state.proofOfWorkDifficulty)," out of ",y(this._minDifficulty))),r.a.createElement("div",null,r.a.createElement("img",{src:"https://i.kym-cdn.com/photos/images/original/001/789/428/a01.gif",alt:"BRRRRR"}))):r.a.createElement("div",null,"Printing is Done! Delivering.",r.a.createElement("br",null),r.a.createElement("div",null,r.a.createElement("img",{src:"https://media0.giphy.com/media/11VKF3OwuGHzNe/source.gif",alt:"Delivering"}))))):r.a.createElement("div",null,"Connecting... ",r.a.createElement("span",{className:"spinner-grow spinner-grow-sm",role:"status","aria-hidden":"true"}));return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("h1",null,"Open Shards Faucet"),r.a.createElement("div",null,r.a.createElement("img",{src:"https://media2.giphy.com/media/3o6Zt3AX5mSM29lGUw/source.gif",alt:"Yo, Cash"})),r.a.createElement("p",null,"There were ",r.a.createElement("span",{className:"font-weight-bold"},this.state.numTransfers," accounts")," funded and total ",r.a.createElement("span",{className:"font-weight-bold"},_(this.state.numTransfers*this._transferAmount)," \u24c3")," tokens were printed.")),r.a.createElement("hr",null),e)}}]),n}(r.a.Component);o.a.render(r.a.createElement(O,null),document.getElementById("root"))}},[[205,1,2]]]);
//# sourceMappingURL=main.898430ec.chunk.js.map