/* ==================== CONTACT PAGE FUNCTIONS ==================== */
const teamMembers = [
  { name: 'user', pic: 'illustration.png/profile.png' },
  { name: 'user', pic: 'illustration.png/profile.png' },
  { name: 'user', pic: 'illustration.png/profile.png' },
  { name: 'user', pic: 'illustration.png/profile.png' },
  { name: 'user', pic: 'illustration.png/profile.png' },
  { name: 'user', pic: 'illustration.png/profile.png' },
  { name: 'user', pic: 'illustration.png/profile.png' },
  { name: 'user', pic: 'illustration.png/profile.png' }
];

function showMemberPopup(index) {
  const popup = document.getElementById('teamPopup');
  const overlay = document.getElementById('overlay');
  const memberPic = document.getElementById('memberPic');
  const memberName = document.getElementById('memberName');

  if (popup && overlay && memberPic && memberName) {
    memberPic.src = teamMembers[index].pic;
    memberPic.onerror = function() {
      this.src = CONFIG.DEFAULT_PROFILE_PIC;
    };
    memberName.innerText = teamMembers[index].name;
    popup.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeMemberPopup() {
  const popup = document.getElementById('teamPopup');
  const overlay = document.getElementById('overlay');
  
  if (popup && overlay) {
    popup.classList.remove('active');
    overlay.classList.remove('active');
  }
}

window.showMemberPopup = showMemberPopup;
window.closeMemberPopup = closeMemberPopup;