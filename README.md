# beima_core

Collection of the beima pensions service provider contracts that servers the beima app.
link: https://beima.app

link to frontend repo: https://github.com/Davien21/beima


To get Started:

Requirement
1:  Yarn or npm
2:  node version of 10.1.2 or higher. (for some reason truffle fails to compile with the latest node version).
    advisable to use the lts version.

3. truffle and Gananche-cli. this will be used for proper testing on the Ethereum MainNet.
4. An infura Account. Visit https://Infura.com to sign up.


How it works.
Copy the Repository link and clone using git clone <INSERT-REPO-LINK-HERE> on the terminal
    
Type "Yarn" to install all dependecies.
    
Open up a seperate terminal for the root folder, 
    
Type "ganache-cli --fork  YOUR-INFURA-API-LINK" --unlock  INSERT-ANY-ACCOUNT-ADDRESS
    
Replace the fromUnlockedAccount variable in the test folder "pension-service.js" with the unlocked account from above.

Finally type truffle test in your terminal to execute on a local chain running on your machine.

there you are tests passed.

Note: Your unlocked account need to have an underlying number of LINK Tokens for test with the compound protocol.


More feautures still being integrated...
