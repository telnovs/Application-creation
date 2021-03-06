import { Component } from '../core/component'
import {apiService} from '../services/api.service'
import {TransformService} from '../services/transform.service.js'
import { renderPost } from '../templates/post.template'


export class PostsComponent extends Component {
  constructor(id,{loader}) {
    super(id)
    this.loader = loader
  }
  //добовляем прослушку событий обрабатываем клик на кпопку мыши
  init(){
    //обращаемся к текущиму элементу и добовляем прослушку событий
    this.$el.addEventListener('click',buttonHandler.bind(this))
  }
  //добовляем прослушку событий
  async onShow(){
    //показываем загрузку
    this.loader.show()
    const fbData = await apiService.fetchPosts()
    // для вывода обьетка с сервеса
    const posts = TransformService.fbObjectToArray(fbData)
    //для вывода поста
    const html =posts.map(post =>renderPost(post,{withButton:true}))
    // скрываем загрузку после получения постов
    this.loader.hide()
    this.$el.insertAdjacentHTML('afterbegin',html.join(' '))
  }
  //очищаем html  когда уходим с данной компаненты с помощью метода onHide
  onHide() {
   this.$el.innerHTML = ' '
  }
}


function buttonHandler(event){
  const $el = event.target
  const id = $el.dataset.id
  //поверяем  если у нас обьект в localStorage
  if (id){
    //создаем переменную и парсим ее
    // если обьект будет пустым (null) тсделаем так что бы возвращался
    //  пусытой массив
   let favorites =JSON.parse(localStorage.getItem('favorites')) || []
    //делаем проверку если в данном массиве уже id
    //для того что бы проверить  если что то в массиве мы можем использовать inc ludes
    if(favorites.includes(id)){
      $el.textContent = 'Сохранить'
      $el.classList.add('button-primary')
      $el.classList.remove('button-danger')
      //если там что то есть то надо удалить элемет
      // удаляем лишнии id из списка путем проверки проверки id c помощью filter
      favorites = favorites.filter(fid => fid !== id)
    }else{
      $el.textContent = 'Удалить'
      $el.classList.remove('button-primary')
      $el.classList.add('button-danger')
      //если нет то нам необходимо добавить элемент
      favorites.push(id)
    }
    //обновляем новый полученный массив в  localStorage и парсим его
    localStorage.setItem('favorites',JSON.stringify(favorites))
  }
}