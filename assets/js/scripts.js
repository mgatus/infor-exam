var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    loginStatus: true,
    profileStatus: false,
    landingPage: false,
    bookmarkpage: false,
    emptyBookmark: false,
    edit: false,
    modal: false,
    rtl: false,
    mobileMenu: false,
    fixed: false,
    apply: '',
    inquire: '',
    newValName: '',
    newValEmail: '',
    newValAddress: '',
    jobsList : [],
    profileInfo : [],
    newRate: [],
    newTech : [],
    newJobTitle : [],
    newCompany : [],
    newJobYear: [],
    bookMarks: [],
    type: []
  },
  mounted: function() {
    this.loadItems();
    this.profileInfo = this.parseData();
    let session = sessionStorage.getItem('login');

    if (localStorage["bookmark"]) {
      this.bookMarks = JSON.parse(window.localStorage.getItem('bookmark'));
      this.emptyBookmark = false
    } else {
      this.emptyBookmark = true
    }

    if(session == 'true') {
      this.loginNow();
    } else {
      this.logOutNow();
    }
  },
  methods: {
    toggleDir: function() {
      this.rtl = this.rtl == false ? true : false;
    },
    toggleMenuMobile: function() {
      this.mobileMenu = this.mobileMenu == false ? true : false;
      this.fixed = this.fixed == false ? true : false;
    },
    loginNow: function() {
      this.loginStatus =  false
      this.profileStatus =  false
      this.landingPage = true
      this.bookmarkpage = false
      sessionStorage.setItem('login', 'true');
    },
    logOutNow: function() {
      this.loginStatus =  true
      this.profileStatus =  false
      this.landingPage = false
      this.bookmarkpage = false
      this.mobileMenu = false
      this.fixed = false
      sessionStorage.clear();
    },
    showBookmark: function() {
      this.loginStatus =  false
      this.profileStatus =  false
      this.landingPage = false
      this.bookmarkpage = true
    },
    profilePage: function() {
      let self = this
      this.bookmarkpage = false
      this.loginStatus =  false
      this.profileStatus =  true
      this.landingPage = false
      console.log(window.localStorage.getItem('profile'))
      if(self.profileInfo === null) {
        let profileobj = this.getReq('data/profile.json');
        profileobj.then(function(profile){
          self.profileInfo = profile;
          localStorage.setItem('profile',JSON.stringify(self.profileInfo));
        }).catch(function(error){
          console.log(error);
        });
      }
    },
    parseData: function() {
      return JSON.parse(window.localStorage.getItem('profile'));
    },
    getReq: function(url){
      return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest();
        xhr.open('GET',url,true);
        xhr.onload = function() {
          if(this.status == 200) {
            // self.jobsList = JSON.parse(this.responseText);
            // console.log(self.jobsList);
            resolve(JSON.parse(this.responseText));
          } else {
            reject(xhr.statusText);
          }
        };
        xhr.onerror = function() {
          reject(xhr.statusText);
        };
        xhr.send();
      })
    },
    loadItems: function() {
      let promise = this.getReq('data/data.json');
      let self = this;
      promise.then(function(data){
        //console.log('this is spart '+ data);
        self.jobsList = data
      }).catch(function(error){
        console.log(error);
      });
    },
    showModalApply: function(d) {
      let self = this;
      let data = self.jobsList;
      for(let i = 0; i < data.length; i++ ) {
        if(data[i].id == d){
          self.apply =  data[i].id;
        }
      }
    },
    showModalInquire: function(d) {
      let self = this;
      let data = self.jobsList;
      for(let i = 0; i < data.length; i++ ) {
        if(data[i].id == d){
          self.inquire =  data[i].id;
        }
      }
    },
    closeThis: function() {
      let self = this;
      self.apply = 0;
      self.inquire = 0;
    },
    editProfile: function(id) {
      this.edit = true;
      var self = this;
      var profileData = self.parseData();

      if(profileData[0].id == id){
        //self.profileInfo.name = profileData[0].name;
        self.newValName = profileData[0].name;
        self.newValEmail = profileData[0].email;
        self.newValAddress = profileData[0].address;

        for(let s = 0; s < profileData[0].skills.length; s++) {
        //alert(profileData[i].skills[s]['technology']);
          self.newTech[s] = profileData[0].skills[s]['technology'];
          self.newRate[s] = profileData[0].skills[s]['rate'];
        }

        for(let s = 0; s < profileData[0].jobs.length; s++) {
        //alert(profileData[i].skills[s]['technology']);
          self.newJobTitle[s] = profileData[0].jobs[s]['title'];
          self.newCompany[s] = profileData[0].jobs[s]['company'];
          self.newJobYear[s] = profileData[0].jobs[s]['year'];
        }
      } else {
        alert('error')
      }

    },
    saveProfile: function() {
      let self = this;
      let newData = this.parseData();
      //alert(self.skills[0])
      if(newData[0].id == self.profileInfo[0].id){
        newData[0].name = self.newValName;
        newData[0].email = self.newValEmail;
        newData[0].address = self.newValAddress;

        for(let s = 0; s < newData[0].skills.length; s++) {
          // alert(self.tech[s]);
          newData[0].skills[s]['technology'] = self.newTech[s];
          newData[0].skills[s]['rate'] = self.newRate[s];
        }

        for(let s = 0; s < newData[0].jobs.length; s++) {
          // alert(self.tech[s]);
          newData[0].jobs[s]['title'] = self.newJobTitle[s];
          newData[0].jobs[s]['company'] = self.newCompany[s];
          newData[0].jobs[s]['year'] = self.newJobYear[s];
        }
        //newData[i].skills[0]['technology'] = 'java';
      } else {
        console.log('no data');
      }

      self.profileInfo = newData;
      //console.log(self.profileInfo)
      let pushData = self.profileInfo;
      this.savingPrivateProfile(pushData)
      this.edit = false;
      //window.localStorage.setItem('profile', JSON.stringify(value));
    },
    cancelProfile: function() {
      this.edit = false;
    },
    savingPrivateProfile: function(value) {
      window.localStorage.setItem('profile', JSON.stringify(value));
    },
    bookMark: function(i) {
      let self = this;
      let booked = self.bookMarks
      let localBooked = JSON.parse(window.localStorage.getItem('bookmark'));
      if(localBooked) {
        for(let b = 0; b < localBooked.length; b++) {
          if(localBooked[b].id == self.jobsList[i].id) {
            this.$toastr.warning('See bookmarks section, Goodbye!', 'Already added', {timeOut: 1000});
            return false;
          }
        }
      }
      booked.push({
        id: self.jobsList[i].id,
        name: self.jobsList[i].name,
        excerpt: self.jobsList[i].excerpt,
        company: self.jobsList[i].company,
        description: self.jobsList[i].description,
        logo: self.jobsList[i].logo,
        rating: self.jobsList[i].rating
      });
      self.type[i] = false;
      localStorage.setItem('bookmark',JSON.stringify(booked));
      this.emptyBookmark = false
      this.$toastr.success('See bookmarks section ', 'Added', {timeOut: 1000});
    }
  },

})
