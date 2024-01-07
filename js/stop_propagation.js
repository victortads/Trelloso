const propagation = {

    stopPropagation: function(classname){
        document.querySelectorAll(`${classname}`).forEach(child => {
            child.addEventListener('click', function(event) {
              event.stopPropagation();
            });
          });
    }
}

export default propagation;