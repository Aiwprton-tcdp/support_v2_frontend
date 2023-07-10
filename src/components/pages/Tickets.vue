<script>
import { inject } from 'vue'
import {
  Input, Button,
} from 'flowbite-vue'
import { StringVal } from '@utils/validation.js'

export default {
  name: 'Groups',
  components: {
    Input, Button,
  },
  data() {
    return {
      AllTickets: Array(),
      tickets: Array(),
      managers: Array(),
      errored: Boolean(),
      search: String(),
    }
  },
  setup() {
    const toast = inject('createToast')
    return { toast }
  },
  mounted() {
    this.Get()
  },
  methods: {
    Get(active = true) {
      this.ax.get(`tickets?active=${active}`).then(r => {
        console.log(r.data.data);
        this.AllTickets = r.data.data.data
        this.tickets = this.AllTickets
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
        this.errored = true
      })
    },
    Create(message) {
      if (StringVal(message)) return

      this.ax.post('tickets', {
        user_id: 1,
        message: message,
      }).then(r => {
        this.toast(r.data.message, r.data.status ? 'success' : 'error')
        if (!r.data.status) return

        this.tickets.push(r.data.data)
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    // Patch(group_id) {
    //   if (StringVal(this.PatchingName)) return

    //   this.ax.patch(`groups/${group_id}`, {
    //     name: this.PatchingName
    //   }).then(r => {
    //     this.toast(r.data.message, r.data.status ? 'success' : 'error')
    //     if (!r.data.status) return

    //     const index = this.AllGroups.findIndex(({id}) => id == group_id)
    //     this.AllGroups[index] = r.data.data
    //     this.PatchingId = 0
    //     this.PatchingName = ''
    //     this.groups = this.AllGroups
    //   }).catch(e => {
    //     this.toast(e.response.data.message, 'error')
    //   })
    // },
    // Delete(group_id) {
    //   this.ax.delete(`groups/${group_id}`).then(r => {
    //     this.toast(r.data.message, r.data.status ? 'success' : 'warning')
    //     if (!r.data.status) return

    //     const index = this.AllGroups.findIndex(({id}) => id == group_id)
    //     this.AllGroups.splice(index, 1)
    //     this.groups = this.AllGroups
    //   }).catch(e => {
    //     this.toast(e.response.data.message, 'error')
    //   })
    // },
    Search() {
      if (this.search.length == 0) {
        this.ClearSearch()
        return
      }

      const id = this.search.replaceAll(/[^0-9]+/g, '')
      const text = this.search.replaceAll(/[^А-яA-z ]+/g, '').toLowerCase()

      this.tickets = this.AllTickets.filter(g => 
        id.length > 0 && g.id.toString().includes(id) ||
        text.length > 0 && g.name.toLowerCase().includes(text)
      )
    },
    ClearSearch() {
      this.search = ''
      this.tickets = this.AllTickets
    },
  }
}
</script>

<template>
<div v-if="tickets.length > 0" class="flex flex-wrap space-x-3 w-1/2 mb-4">
  <Input @keyup.enter="Search()" v-model.trim="search" placeholder="Введите id или название" label="" class="flex-1">
    <template #prefix>
      <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </template>
  </Input>
  <Button v-if="search.length > 0" @click="Search()" color="default">Искать</Button>
  <Button v-if="search.length > 0" @click="ClearSearch()" color="light">Сброс</Button>
</div>

<div class="grid grid-cols-3 gap-2">
  <div v-if="errored">
    <p>Ошибка</p>
    <Button @click="Get()" color="default">Перезагрузить</Button>
  </div>
  <div v-else-if="tickets.length == 0">
    <p>Нет данных</p>
    <Button @click="Get()" color="default">Перезагрузить</Button>
  </div>
  <div v-else class="flex flex-wrap overflow-x-auto max-h-32 gap-3">
    <div v-for="t in tickets" class="rounded-md border p-3">
      {{ t.name }}
      <!-- {{ t.id }} -->
    </div>
  </div>

  <div class="col-span-2">
    <Button @click="Create('test')" color="green">Новое обращение</Button>
    <RouterView />
  </div>
</div>
</template>