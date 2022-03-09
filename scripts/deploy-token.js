/** @format */

import sdk from './initialize-sdk';

const app = sdk.getAppModule('0x63EE7CCC69B8f25f17666AEAcb1EE3f5B62D696d');

(async () => {
	try {
		// Deploy a standard ERCO-20 contract
		const tokenModule = await app.deployTokenModule({
			name: 'Beima Governance Token',
			symbol: 'BMP',
		});
		console.log(
			'Successfully Deployed token module, address at:',
			tokenModule.address,
		);
	} catch (error) {
		console.log('Failed to deploy Token Module', error);
	}
})();
