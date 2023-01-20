

exports.success = function responseSuccess(data) {
    return {
        statusCode: 200,
        status: true,
        message: "success",
        data: data
    }
}

exports.successNoData = function responseSuccess() {
    return {
        statusCode: 201,
        status: true,
        message: "success",
        data: []
    }
}

exports.signoutSuccess = function responseSuccessSignOut() {
    return {
        statusCode: 200,
        status: true,
        message: "success Signout"
    }
}

