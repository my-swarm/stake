type Ethereum = any;

export class Metamask {
  private readonly ethereum: Ethereum;
  private _currentChainId?: number = undefined;
  private _currentAccount?: string = undefined;

  private stateUpdateCallback: (ethereum: Ethereum) => void = () => {};

  constructor(ethereum: Ethereum) {
    ethereum.autoRefreshOnNetworkChange = false;
    this.ethereum = ethereum;
  }

  /**
   * Handle chain (network) and chainChanged, per EIP 1193
   */
  private handleChainChanged = (chainId: number, skipCallback = false) => {
    if (this._currentChainId !== chainId) {
      this._currentChainId = chainId;
      // Run any other necessary logic...
      if (!skipCallback) {
        this.stateUpdateCallback(this.ethereum);
      }
    }
  };

  // For now, 'eth_accounts' will continue to always return an array
  private handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // This means the user has locked metamask (analogy to logout)
      // so we don't do anything
      this._currentAccount = undefined;
    } else if (accounts[0] !== this._currentAccount) {
      this._currentAccount = accounts[0];
    }
    // Run any other necessary logic...
    this.stateUpdateCallback(this.ethereum);
  };

  public init(): void {
    const { ethereum } = this;
    if (!ethereum || !ethereum.isMetaMask) {
      console.log('Please install MetaMask.');
      throw new Error('Please install MetaMask.');
    }

    try {
      const chainId = ethereum.send('eth_chainId');
      this.handleChainChanged(chainId, true);
      const accounts = ethereum.send('eth_accounts');
      this.handleAccountsChanged(accounts);
    } catch (err) {
      // In the future, maybe in 2020, this will return a 4100 error if
      // the user has yet to connect
      if (err.code === 4100) {
        // EIP 1193 unauthorized error
        throw new Error('Please connect to MetaMask.');
      }
    }

    ethereum.on('chainChanged', this.handleChainChanged);
    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    ethereum.on('accountsChanged', this.handleAccountsChanged);
  }

  public connect(): void {
    // This is equivalent to ethereum.enable()
    try {
      const accounts = this.ethereum.send('eth_requestAccounts');
      this.handleAccountsChanged(accounts);
    } catch (err) {
      console.error(err);
      if (err.code === 4001) {
        // EIP 1193 userRejectedRequest error
        throw new Error('Please connect to MetaMask.');
      }
    }
    this.stateUpdateCallback(this.ethereum);
  }

  public initAndConnect(silent = false): void {
    try {
      this.init();
      if (!silent) {
        this.connect();
      }
      return this.ethereum;
    } catch (err) {
      console.error(err);
      if (!silent) {
        throw err;
      }
    }
  }

  public disconnect(): void {
    this.ethereum.disable();
  }

  public onStateUpdate(callback: (ethereum: Ethereum) => void): void {
    this.stateUpdateCallback = callback;
  }

  get connected(): boolean {
    return this._currentAccount !== undefined;
  }
}
