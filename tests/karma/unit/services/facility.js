describe('Facility service', function() {

  'use strict';

  var service,
      $httpBackend;

  beforeEach(function (){
    module('inboxApp');
    module(function ($provide) {
      $provide.value('BaseUrlService', function() {
        return 'BASEURL';
      });
    });
    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      service = $injector.get('Facility');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var makeUrl = function(districtId) {
    var url = 'BASEURL/facilities.json';
    if (districtId) {
      url += '/' + districtId;
    }
    return encodeURI(url);
  };

  it('returns errors from request', function(done) {

    $httpBackend
      .expect('GET', makeUrl())
      .respond(503, 'boom');

    service(function(err) {
      chai.expect(err.message).to.equal('boom');
      done();
    });

    $httpBackend.flush();
  });

  it('returns zero when no facilities', function(done) {

    $httpBackend
      .expect('GET', makeUrl())
      .respond({ rows: [] });

    service(function(err, actual) {
      chai.expect(err).to.equal(null);
      chai.expect(actual).to.deep.equal([]);
      done();
    });

    $httpBackend.flush();
  });

  it('returns all clinics when no user district', function(done) {

    var clinicA = {
      "id": "920a7f6a-d01d-5cfe-7c9182fe6551322a",
      "key": [
        "clinic"
      ],
      "value": {
        "name": "Maori Hill"
      },
      "doc": {
        "_id": "920a7f6a-d01d-5cfe-7c9182fe6551322a",
        "_rev": "2-55151d808dacc7f12fdd1513f2eddc75",
        "type": "clinic",
        "name": "Maori Hill",
        "parent": {
          "_id": "a301463e-74ba-6e2a-3424d30ef5089a7f",
          "_rev": "6-ef6e63875cb6322e48e3f964f460bd7a",
          "type": "health_center",
          "name": "Dunedin",
          "parent": {
            "_id": "a301463e-74ba-6e2a-3424d30ef5087d1c",
            "_rev": "3-42c1cfd045c5d80dd98ccc85c47f44ae",
            "type": "district_hospital",
            "name": "Otago",
            "parent": {},
            "contact": {
              "name": "Ralph",
              "phone": "555"
            }
          },
          "contact": {
            "name": "Sharon",
            "phone": "556"
          }
        }
      }
    };

    var clinicB = {
      "id": "a301463e-74ba-6e2a-3424d30ef508a488",
      "key": [
        "clinic"
      ],
      "value": {
        "name": "Andy Bay",
        "contact": {
          "name": "Gareth",
          "phone": "557557557"
        },
        "phone": "557557557"
      },
      "doc": {
        "_id": "a301463e-74ba-6e2a-3424d30ef508a488",
        "_rev": "74-30d4791ba64f13592f86023344fa9449",
        "type": "clinic",
        "name": "Andy Bay",
        "contact": {
          "name": "Gareth",
          "phone": "557557557"
        },
        "parent": {
          "_id": "a301463e-74ba-6e2a-3424d30ef5089a7f",
          "_rev": "6-ef6e63875cb6322e48e3f964f460bd7a",
          "type": "health_center",
          "name": "Dunedin",
          "parent": {
            "_id": "a301463e-74ba-6e2a-3424d30ef5087d1c",
            "_rev": "3-42c1cfd045c5d80dd98ccc85c47f44ae",
            "type": "district_hospital",
            "name": "Otago",
            "parent": {},
            "contact": {
              "name": "Ralph",
              "phone": "555"
            }
          },
          "contact": {
            "name": "Sharon",
            "phone": "556"
          }
        },
        "sent_forms": {
          "R": "2014-07-10T02:10:28.776Z",
          "STCK": "2014-07-09T23:28:45.949Z",
          "XXXXXXX": "2014-07-01T00:46:24.362Z",
          "\u00e0\u00a4\u2014": "2014-07-02T02:06:32.270Z",
          "ANCR": "2014-07-10T02:58:53.095Z"
        }
      }
    };

    var healthCenter = {
      "id": "920a7f6a-d01d-5cfe-7c9182fe65516194",
      "key": [
        "health_center"
      ],
      "value": {
        "name": "Sumner"
      },
      "doc": {
        "_id": "920a7f6a-d01d-5cfe-7c9182fe65516194",
        "_rev": "4-d7d7e3ab5276fbd1bc9c9ca6b10f4ee1",
        "type": "health_center",
        "name": "Sumner",
        "parent": {
          "_id": "920a7f6a-d01d-5cfe-7c9182fe6551510e",
          "_rev": "2-5b71b72299224c2500389db753116155",
          "type": "district_hospital",
          "name": "Christchurch",
          "sent_forms": {
            "R": "2014-06-30T04:08:06.657Z"
          }
        }
      }
    };

    $httpBackend
      .expect('GET', makeUrl())
      .respond({ rows: [ clinicA, healthCenter, clinicB ] });

    service({ types: ['clinic'] }, function(err, actual) {
      chai.expect(err).to.equal(null);
      chai.expect(actual).to.deep.equal([ clinicA, clinicB ]);
      done();
    });

    $httpBackend.flush();
  });

  it('queries for user district', function(done) {

    $httpBackend
      .expect('GET', makeUrl('554'))
      .respond({ rows: [ ] });

    service({ types: ['clinic'], district: '554' }, function(err, actual) {
      chai.expect(err).to.equal(null);
      chai.expect(actual).to.deep.equal([ ]);
      done();
    });

    $httpBackend.flush();
  });
});
