                          //  ============================toggle icoln navbar==============================
 let menuIcon  = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
menuIcon.onclick = ()=>{
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active')
}
                // ============================================scroll section=========================================
let sections =document.querySelectorAll('section');
let navLink =document.querySelectorAll('header nav a');
window.onscroll = ()=>{
    sections.forEach(sec => {
        let top= window.scrollY;
        let offset  = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id =sec.getAttribute('id');
        if(top >= offset && top < offset + height){
            navLink.forEach(links =>{
                links.classList.remove('active');
                document.querySelector('header nav a[herf*=' + id + ']').classList.add('active')
            });
        };
    });
                    // ============================================sticky navbar=========================================
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

                // ============================================remove toggle icon and navbar=========================================
    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');

};

                // ============================================Scroll reveal=========================================
ScrollReveal({
    distance:'80px',
    duration: 2000,
    delay: 200,
});
ScrollReveal().reveal('.home-content, headinh', { origin:'top'});
ScrollReveal().reveal('.home-img, .Skill-container, .portfolio-box, .contact form', { origin:'buttom' });
ScrollReveal().reveal('.home-contact h1, .about-img', { origin:'left' });
ScrollReveal().reveal('.home-contact p, .about-content', { origin: 'right' });

                // ============================================Scroll reveal=========================================
const typed = new Typed('.multiple-text',{
    strings: ['Frontent Developer','Web Developer', 'YouTuber','UI/UX Designer','App Developer'],
    typeSpeed: 70,
    backSpeed: 70,
    backDelay:1000,
    loop: true,

});