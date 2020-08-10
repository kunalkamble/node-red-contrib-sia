module.exports = {
    'wallet': ['wallet', false],
    'wallet/address': ['wallet/address', true],
    'wallet/addresses': ['wallet/addresses', false],
    'wallet/seeds': ['wallet/seeds', false],
    'wallet/seedaddrs': ['wallet/seedaddrs', false],
    'wallet/transactions': ['wallet/transactions', false],
    'wallet/backup': ['wallet/backup?destination=/home/wallet-settings.backup', true],
    'wallet/verifypassword': ['wallet/verifypassword?password=', true],
    'wallet/watch': ['wallet/watch', true],
    'wallet/lock': ['wallet/lock', false, false, true],
    'wallet/unlock': ['wallet/unlock', true, true],
    'consensus': ['consensus', false],
    'consensus/blocks': ['consensus/blocks', false],
    'skynet/portals': ['skynet/portals', false],
    'POST skynet/portals': ['skynet/portals', true, false, true],
    'GET skynet/skylink': ['skynet/skylink', false]
}