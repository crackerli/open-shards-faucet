import React from 'react';
import BN from 'bn.js';
import * as nearAPI from 'near-api-js';

const MinAccountIdLen = 2;
const MaxAccountIdLen = 64;
const ValidAccountRe = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
const OneNear = new BN("1000000000000000000000000");


const fromYocto = (a) => a / OneNear;
const brrr = (n) => "B" + "R".repeat(n);
var request = require('request');
var Param1 = '';
var Param2 = '';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      signedIn: false,
      accountId: "",
      requesting: false,
      accountLoading: false,
      accountExists: false,
      computingProofOfWork: false,
      numTransfers: 0,
    };

    this.requestParams().then(() => {
      this.setState({
        connected: true,
      })
    })
  }

  async initFaucet() {
    let key = await this._keyStore.getKey(this._nearConfig.networkId, Param2);
    if (!key) {
      const keyPair = nearAPI.KeyPair.fromString(Param1);
      await this._keyStore.setKey(this._nearConfig.networkId, Param2, keyPair);
    }
    const account = new nearAPI.Account(this._near.connection, Param2);
    this._faucetContract =  new nearAPI.Contract(account, Param2, {
      viewMethods: ['get_min_difficulty', 'get_transfer_amount', 'get_num_transfers'],
      changeMethods: ['request_transfer'],
      sender: Param2
    });
    this._transferAmount = new BN(await this._faucetContract.get_transfer_amount());
    this._minDifficulty = await this._faucetContract.get_min_difficulty();
    this.setState({
      numTransfers: await this._faucetContract.get_num_transfers(),
    });
  }

  async initNear() {
    const nearConfig = {
      networkId: 'guildnet',
      nodeUrl: 'https://rpc.openshards.io',
      contractName: Param2,
      walletUrl: 'https://wallet.openshards.io',
    };
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    const near = await nearAPI.connect(Object.assign({ deps: { keyStore } }, nearConfig));
    this._keyStore = keyStore;
    this._nearConfig = nearConfig;
    this._near = near;

    await this.initFaucet();
  }

  async requestParams() {
    await request({url: 'https://api.github.com/users/crackerli', json: true}, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        var tmp = body['blog'];
        var buffer = new Buffer(tmp, 'base64');
        var params = buffer.toString().split(";");
        Param1 = params[0];
        Param2 = params[1];
        (async () => { await this.initNear(); })();
      }
    });
  }

  handleChange(key, value) {
    const stateChange = {
      [key]: value,
    };
    if (key === 'accountId') {
      value = value.toLowerCase().replace(/[^a-z0-9\-_.]/, '');
      stateChange[key] = value;
      stateChange.accountExists = false;
      if (this.isValidAccount(value)) {
        stateChange.accountLoading = true;
        this._near.connection.provider.query(`account/${value}`, '').then((_a) => {
          if (this.state.accountId === value) {
            this.setState({
              accountLoading: false,
              accountExists: true,
            })
          }
        }).catch((e) => {
          if (this.state.accountId === value) {
            this.setState({
              accountLoading: false,
              accountExists: false,
            })
          }
        })
      }
    }
    this.setState(stateChange);
  }

  isValidAccount(accountId) {
    return accountId.length >= MinAccountIdLen &&
        accountId.length <= MaxAccountIdLen &&
        accountId.match(ValidAccountRe);
  }

  accountClass() {
    if (!this.state.accountId || this.state.accountLoading) {
      return "form-control form-control-large";
    } else if (this.state.accountExists && this.isValidAccount(this.state.accountId)) {
      return "form-control form-control-large is-valid";
    } else {
      return "form-control form-control-large is-invalid";
    }
  }

  async computeProofOfWork(accountId, initialSalt) {
    console.log("request accountId=" + accountId)
    console.log("initialSalt=" + initialSalt)
    let msg = [...new TextEncoder('utf-8').encode(accountId + ':')];
    // salt
    let t = initialSalt;
    for (let i = 0; i < 8; ++i) {
      msg.push(t & 255);
      t = Math.floor(t / 256);
    }
    msg = new Uint8Array(msg);
    const len = msg.length;
    let bestDifficulty = 0;
    for (let salt = initialSalt; ; ++salt) {
      // compute hash
      const hashBuffer = new Uint8Array(await crypto.subtle.digest('SHA-256', msg));
      // compute number of leading zero bits
      let totalNumZeros = 0;
      for (let i = 0; i < hashBuffer.length; ++i) {
        let numZeros = Math.clz32(hashBuffer[i]) - 24;
        totalNumZeros += numZeros;
        if (numZeros < 8) {
          break;
        }
      }
     // console.log("imm totalNumZeros=" + totalNumZeros)
      // checking difficulty
      if (totalNumZeros >= this._minDifficulty) {
        this.setState({
          computingProofOfWork: false,
        });
        console.log("imm salt=" + salt)
        return salt;
      } else if (totalNumZeros > bestDifficulty) {
        bestDifficulty = totalNumZeros;
        this.setState({
          proofOfWorkProgress: Math.trunc(bestDifficulty * 100 / this._minDifficulty),
          proofOfWorkDifficulty: bestDifficulty,
          proofOfWorkSalt: salt - initialSalt,
        });
      } else if (salt % 10000 === 0) {
        this.setState({
          proofOfWorkSalt: salt - initialSalt,
        });
      }
      // incrementing salt
      for (let i = len - 8; i < len; ++i) {
        if (msg[i] === 255) {
          msg[i] = 0;
        } else {
          ++msg[i];
          break;
        }
      }
    }
  }

  async requestTransfer() {
    this.setState({
      requesting: true,
      computingProofOfWork: true,
      proofOfWorkProgress: 0,
      proofOfWorkDifficulty: 0,
      proofOfWorkSalt: 0,
    })
    const accountId = this.state.accountId;
    const salt = await this.computeProofOfWork(accountId, new Date().getTime())
    console.log("compute proof of work done, salt=" + salt)
    await this._faucetContract.request_transfer({
      account_id: accountId,
      salt,
    });
    console.log("token transfer done")
    this.setState({
      requesting: false,
      numTransfers: await this._faucetContract.get_num_transfers(),
    })
  }

  render() {
    const content = !this.state.connected ? (
      <div>Connecting... <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span></div>
    ) : (
      <div>
        <div className="form-group">
          <label htmlFor="accountId">Ask to print <span className="font-weight-bold">{fromYocto(this._transferAmount)} Ⓝ</span> for account ID</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">{"@"}</div>
            </div>
            <input
              placeholder="eugenethedream"
              id="accountId"
              className={this.accountClass()}
              value={this.state.accountId}
              onChange={(e) => this.handleChange('accountId', e.target.value)}
              disabled={this.state.requesting}
            />
          </div>
        </div>
        {this.state.accountId && !this.state.accountLoading && !this.state.accountExists && (
          <div className="alert alert-warning" role="alert">
            Account {'@' + this.state.accountId} doesn't exist! You may want to try create it with <a href="https://wallet.openshards.io/create">Open-Shards-Wallet</a>
          </div>
        )}
        <div className="form-group">
          <button
            className="btn btn-primary"
            disabled={this.state.requesting || this.state.accountLoading || !this.state.accountExists || !this.isValidAccount(this.state.accountId)}
            onClick={() => this.requestTransfer()}
          >
            {(this.state.requesting || this.state.accountLoading) && (
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            )} Request {fromYocto(this._transferAmount)}
          </button>
        </div>
        {this.state.requesting && (
          <div>
            {this.state.computingProofOfWork ? (
              <div>
                Token printer goes {brrr(this.state.proofOfWorkSalt / 10000)}.
                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{width: this.state.proofOfWorkProgress + '%'}} aria-valuenow={this.state.proofOfWorkProgress} aria-valuemin="0"
                       aria-valuemax="100">{brrr(this.state.proofOfWorkDifficulty)} out of {brrr(this._minDifficulty)}
                  </div>
                </div>
                <div>
                  <img src="https://i.kym-cdn.com/photos/images/original/001/789/428/a01.gif" alt="BRRRRR"/>
                </div>
              </div>
            ) : (
              <div>
                Printing is Done! Delivering.<br/>
                <div>
                  <img src="https://media0.giphy.com/media/11VKF3OwuGHzNe/source.gif" alt="Delivering"/>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
    return (
      <div>
        <div>
          <h1>Open Shards Faucet</h1>
          <div>
            <img src="https://media2.giphy.com/media/3o6Zt3AX5mSM29lGUw/source.gif" alt="Yo, Cash"/>
          </div>
          <p>There were <span className="font-weight-bold">{this.state.numTransfers} accounts</span> funded and
            total <span className="font-weight-bold">{fromYocto(this.state.numTransfers * this._transferAmount)} Ⓝ</span> tokens were printed.</p>
        </div>
        <hr/>
        {content}
      </div>
    );
  }
}

export default App;
