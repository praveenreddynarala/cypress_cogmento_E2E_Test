
module.exports = () => {
    return Object.assign({},
            require('../../fixtures/mock_responses/test.json'),
            require('../../fixtures/mock_responses/db.json'),
            require('../../fixtures/mock_responses/cart_mock_data.json'),
            require('../../fixtures/mock_responses/data.json')
        );
    }