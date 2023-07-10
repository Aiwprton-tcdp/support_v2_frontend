<script>
import { inject } from 'vue'
import {
  Table, TableHead,
  TableBody, TableHeadCell,
  TableRow, TableCell,
  Input, Button,
  Select, Modal
} from 'flowbite-vue'
import VueMultiselect from 'vue-multiselect'
import { StringVal } from '@utils/validation.js'

export default {
  name: 'Groups',
  components: {
    Table, TableHead,
    TableBody, TableHeadCell,
    TableRow, TableCell,
    Input, Button,
    Select, Modal,
    VueMultiselect
  },
  data() {
    return {
      AllGroups: Array(),
      groups: Array(),
      managers: Array(),
      OnlyInGroup: Array(),
      errored: Boolean(),
      isShowModal: Boolean(),
      CurrentGroup: Object(),
      NewGroupName: String(),
      PatchingId: Number(),
      PatchingName: String(),
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
    Get() {
      this.ax.get('groups').then(r => {
        this.AllGroups = r.data.data.data
        this.groups = this.AllGroups
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
        this.errored = true
      }).finally(this.GetUsers)
    },
    GetUsers() {
      this.ax.get('users?role=2').then(r => {
        this.managers = r.data.data.data
        this.managers.forEach(u => u.value = u.id)
        
        if (this.managers.length == 0) {
          this.toast('Нет ни одного менеджера', 'warning')
          return
        }
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    Create() {
      if (StringVal(this.NewGroupName)) return

      this.ax.post('groups', {
        name: this.NewGroupName,
      }).then(r => {
        this.toast(r.data.message, r.data.status ? 'success' : 'error')
        if (!r.data.status) return

        this.AllGroups.push(r.data.data)
        this.groups = this.AllGroups
        this.NewGroupName = ''
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    AddToGroup(data) {
      console.log(data)
      this.ax.post('manager_groups', {
        user_id: data.id,
        group_id: this.CurrentGroup.id,
      }).then(r => {
        this.toast(r.data.message, r.data.status ? 'success' : 'error')
        if (r.data.status) {
          data.in_group = true
          data.mg_id = r.data.data.id
        }
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    Patch(group_id) {
      if (StringVal(this.PatchingName)) return

      this.ax.patch(`groups/${group_id}`, {
        name: this.PatchingName
      }).then(r => {
        this.toast(r.data.message, r.data.status ? 'success' : 'error')
        if (!r.data.status) return

        const index = this.AllGroups.findIndex(({id}) => id == group_id)
        this.AllGroups[index] = r.data.data
        this.PatchingId = 0
        this.PatchingName = ''
        this.groups = this.AllGroups
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    Delete(group_id) {
      this.ax.delete(`groups/${group_id}`).then(r => {
        this.toast(r.data.message, r.data.status ? 'success' : 'warning')
        if (!r.data.status) return

        const index = this.AllGroups.findIndex(({id}) => id == group_id)
        this.AllGroups.splice(index, 1)
        this.groups = this.AllGroups
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    RemoveFromGroup(data) {
      this.ax.delete(`manager_groups/${data.mg_id}`).then(r => {
        this.toast(r.data.message, r.data.status ? 'success' : 'error')
        if (r.data.status) {
          data.in_group = false
          delete data.mg_id
        }
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    Search() {
      if (this.search.length == 0) {
        this.ClearSearch()
        return
      }

      const id = this.search.replaceAll(/[^0-9]+/g, '')
      const text = this.search.replaceAll(/[^А-яA-z ]+/g, '').toLowerCase()

      this.groups = this.AllGroups.filter(g => 
        id.length > 0 && g.id.toString().includes(id) ||
        text.length > 0 && g.name.toLowerCase().includes(text)
      )
    },
    ClearSearch() {
      this.search = ''
      this.groups = this.AllGroups
    },
    ShowModal(data) {
      this.isShowModal = !this.isShowModal
      this.CurrentGroup = data

      this.ax.get(`manager_groups?group=${data.id}`).then(r => {
        this.OnlyInGroup = []
        this.managers.forEach(m => {
          let mgf = r.data.data.filter(mg => mg.user_id == m.id)
          m.in_group = mgf.length > 0
          if (m.in_group) {
            m.mg_id = mgf[0].id
            this.OnlyInGroup.push(m)
            console.log(this.OnlyInGroup)
          }
        })
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    CloseModal() {
      this.isShowModal = !this.isShowModal
    },
    PrepareForPatch(data = null) {
      this.PatchingId = data?.id ?? 0
      this.PatchingName = data?.name
    },
  },
  watch: {
    OnlyInGroup(newValue, oldValue) {
      this.OnlyInGroup = newValue
    }
  }
}
</script>

<template>
<div v-if="AllGroups.length > 0" class="flex flex-wrap space-x-3 w-1/2 mb-4">
  <Input @keyup.enter="Search()" v-model.trim="search" placeholder="Введите id или название" label="" class="flex-1">
    <template #prefix>
      <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </template>
  </Input>
  <Button v-if="search.length > 0" @click="Search()" color="default">Искать</Button>
  <Button v-if="search.length > 0" @click="ClearSearch()" color="light">Сброс</Button>
</div>

<Table hoverable>
  <TableHead>
    <TableHeadCell>Id</TableHeadCell>
    <TableHeadCell>Название</TableHeadCell>
    <TableHeadCell><span class="sr-only">Edit</span></TableHeadCell>
  </TableHead>

  <TableBody>
    <TableRow>
      <TableCell>~{{ AllGroups.length+1 }}</TableCell>
      <TableCell>
        <Input v-model.trim="NewGroupName" placeholder="Введите название новой группы" />
      </TableCell>
      <TableCell>
        <div class="space-x-3">
          <Button :disabled="NewGroupName.length < 3" @click="Create()" color="green">Добавить</Button>
          <Button v-if="NewGroupName.length > 0" @click="NewGroupName = ''" color="light">Сброс</Button>
        </div>
      </TableCell>
    </TableRow>

    <TableRow v-for="g in groups">
      <TableCell>{{ g.id }}</TableCell>
      <TableCell>
        <p v-if="PatchingId != g.id">{{ g.name }}</p>
        <Input v-else v-model.trim="PatchingName" placeholder="Введите новое название" />
      </TableCell>
      <TableCell>
        <div v-if="PatchingId == g.id" class="space-x-3">
          <Button @click="Patch(g.id)" color="green">Сохранить</Button>
          <Button @click="PrepareForPatch()" color="light">Отменить</Button>
        </div>
        <div v-else class="space-x-3">
          <Button v-if="!g.alone" @click="ShowModal(g)" color="light">Открыть</Button>
          <Button @click="PrepareForPatch(g)" color="light">Редактировать</Button>
          <Button @click="Delete(g.id)" color="red">Удалить</Button>
        </div>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>



<Modal size="4xl" v-if="isShowModal" @close="CloseModal">
  <template #header>
    <div class="flex items-center text-lg">
      <p>Группа: </p><b>{{ CurrentGroup.name }}</b>
    </div>
  </template>

  <template #body>
    <div class="flex flex-wrap space-2">
      <VueMultiselect
        v-model="OnlyInGroup"
        :options="managers"
        :multiple="true"
        :close-on-select="false"
        placeholder="Выберите менеджера"
        @select="AddToGroup"
        @remove="RemoveFromGroup"
        label="name"
        track-by="name">
        <template #noResult>Нет данных</template>

        <template slot="option" slot-scope="props">
          <img class="option__image" :src="props.option.avatar" alt="avatar">
          <span>{{ props.option.text }}</span>
        </template>
        
        <template slot="tag" slot-scope="{ option, remove }">
          <!-- <img class="tag__image" :src="option.avatar" alt="avatar"> -->
          <span class="multiselect__tag">
            <span>{{ option.text }}</span>
            <span class="multiselect__tag-icon" @click.prevent="remove(option)"></span>
          </span>
        </template>
      </VueMultiselect>
      
      <!-- <div v-for="m in managers" class="inline-flex">
        <span v-if="m.in_group"
          class="items-center px-2 py-1 mr-2 text-sm font-medium rounded text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
          {{ m.name }}
          <button @click="RemoveFromGroup(m)" class="inline-flex items-center p-1 ml-2 text-sm text-red-400 bg-transparent rounded-sm hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-300">
            <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </span>
        <span v-else
          class="items-center px-2 py-1 mr-2 text-sm font-medium rounded text-black-800 bg-black-100 dark:bg-black-900 dark:text-black-300">
          {{ m.name }}
          <button @click="AddToGroup(m)"
            class="inline-flex items-center p-1 ml-2 text-sm text-green-400 bg-transparent rounded-sm hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-300">
            <span>+</span>
          </button>
        </span>
      </div> -->
    </div>
  </template>

  <template #footer>
    <div class="flex justify-between">
      <button @click="CloseModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
        Отменить
      </button>
      <button @click="CloseModal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Применить
      </button>
    </div>
  </template>
</Modal>



<div>
  <div v-if="errored">
    <p>Ошибка</p>
  </div>
  <div v-else-if="groups.length == 0">
    <p>Нет данных</p>
  </div>
</div>
</template>