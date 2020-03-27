const callback  = require('../lib/utils/utils').callbackReturn
const httpMocks = require('node-mocks-http')
const user      = require('../controllers/userController.js')
const userDB    = require('../models/userModel.js')

describe('create', () => {
  test('A new user is created', () => {
    const data = {
      email: '00-00000@usb.ve',
      password: 'password',
      phoneNumber: 'phoneNumber'
    }
    var request = httpMocks.createRequest({
      body: data
    })
    var response = httpMocks.createResponse()
    user.create(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(200)
    })
  })

  test('An existed user is not created', () => {
    userDB.create({
      email: '00-00000@usb.ve',
      password: 'password',
      phone_number: 'phoneNumber',
      isVerify: true
    }).then(callback)
    const data = {
      email: '00-00000@usb.ve',
      password: 'password',
      phoneNumber: 'phoneNumber'
    }
    var request = httpMocks.createRequest({
      body: data
    })
    var response = httpMocks.createResponse()
    user.create(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(403)
    })
  })

  test('A request without email fails', () => {
    const data = {
      email: '00-00000',
      password: 'password',
      phoneNumber: 'phoneNumber'
    }
    var request = httpMocks.createRequest({
      body: data
    })
    var response = httpMocks.createResponse()
    user.create(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(400)
    })
  })

  test('A request without password fails', () => {
    const data = {
      email: '00-00000@usb.ve',
      password: '',
      phoneNumber: 'phoneNumber'
    }
    var request = httpMocks.createRequest({
      body: data
    })
    var response = httpMocks.createResponse()
    user.create(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(400)
    })
  })

  test('A request without phone number fails', () => {
    const data = {
      email: '00-00000@usb.ve',
      password: 'password',
      phoneNumber: ''
    }
    var request = httpMocks.createRequest({
      body: data
    })
    var response = httpMocks.createResponse()
    user.create(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(400)
    })
  })
})

describe('codeValidate', () => {
  beforeEach(() => {
    userDB.create({
      email: '00-00000@usb.ve',
      password: 'password',
      phone_number: 'phoneNumber',
      temporalCode: 123456789
    }).then(callback)
    userDB.create({
      email: '11-11111@usb.ve',
      password: 'password',
      phone_number: 'phoneNumber',
      isVerify: true,
      temporalCode: 0
    }).then(callback)
  })

  afterEach(() => { userDB.deleteOne({ email: '00-00000@usb.ve' }, callback) })

  test('A new user is verified', () => {
    const request = httpMocks.createRequest({
      body: { code: '123456789', email: '00-00000' }
    })
    const response = httpMocks.createResponse()
    user.codeValidate(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(200)
    })
  })

  test('A request without code', () => {
    const request  = httpMocks.createRequest({ body: { email: '00-00000' } })
    const response = httpMocks.createResponse()
    user.codeValidate(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(403)
    })
  })

  test('A request without email', () => {
    const request  = httpMocks.createRequest({ body: { code: '0' } })
    const response = httpMocks.createResponse()
    user.codeValidate(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(401)
    })
  })

  test('User is not pending for validating', () => {
    const request  = httpMocks.createRequest({
      body: { code: '0', email: '00-00001@usb.ve' }
    })
    const response = httpMocks.createResponse()
    user.codeValidate(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(401)
    })
  })

  test('User had been already validated', () => {
    const request  = httpMocks.createRequest({
      body: { code: '0', email: '11-11111@usb.ve' }
    })
    const response = httpMocks.createResponse()
    user.codeValidate(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(401)
    })
  })

  test('User is not pending for validating', () => {
    const request  = httpMocks.createRequest({
      body: { code: '987654321', email: '00-00000@usb.ve' }
    })
    const response = httpMocks.createResponse()
    user.codeValidate(request, response).then(sucs => {
      expect(sucs.statusCode).toBe(401)
    })
  })

})

describe('getUserInformation', () => {
  beforeEach(() => {})

  afterEach(() => {})

  test('test case', () => {
    //test code
  })
})

describe('updateUser', () => {
  beforeEach(() => {})

  afterEach(() => {})

  test('test case', () => {
    //test code
  })
})

describe('updateProfilePic', () => {
  beforeEach(() => {})

  afterEach(() => {})

  test('test case', () => {
    //test code
  })
})

describe('addVehicle', () => {
  beforeEach(() => {})

  afterEach(() => {})

  test('test case', () => {
    //test code
  })
})

describe('deleteVehicle', () => {
  beforeEach(() => {})

  afterEach(() => {})

  test('test case', () => {
    //test code
  })
})
