

function responseSuccess(data) {
    return {
        statusCode: 200,
        status: true,
        message: "success",
        data: data
    }
}


module.exports = responseSuccess;
