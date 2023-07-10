<script>
import { provide, ref } from 'vue'
import { toast } from 'vue3-toastify'
// import Emitter from 'tiny-emitter'
import Header from '@temps/Header.vue'

export default {
  components: { Header },
  setup() {
    // const UserData = ref(Object())
    // const UnreadMessagesCount = ref(Number())
    // const UnreadMessages = ref(Array())
    // const emitter = ref(new Emitter())

    // const toast = Vue3Toastify()
    const createToast = (text, type) => {
      switch (type) {
        case 'error':
          toast.error(text)
          break
        case 'success':
          toast.success(text)
          break
        case 'warning':
          toast.warn(text)
          break
      
        default:
          toast.info(text)
          break
      }
    }
    
    // const NewMessage = function(data) {
    //   UnreadMessagesCount.value++
    //   this.emitter.emit('NewUnreadMessage', data)
    // }
    
    // provide('UserData', UserData)
    // provide('UnreadMessages', UnreadMessages)
    // provide('UnreadMessagesCount', UnreadMessagesCount)
    provide('createToast', createToast)
    // provide('NewMessage', NewMessage)
    // provide('emitter', emitter)

    return {
      // UserData,
      // UnreadMessages,
      // UnreadMessagesCount,
      createToast,
      // NewMessage,
      // emitter,
    }
  },
}
</script>

<template>
<Header/>
  
<!-- <div class="my-14"> -->
<div>
  <RouterView />
</div>
</template>
