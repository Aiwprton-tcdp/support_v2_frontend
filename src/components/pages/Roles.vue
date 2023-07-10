<script>
import { inject } from 'vue'
import {
  Table, TableHead,
  TableBody, TableHeadCell,
  TableRow, TableCell,
  Input, Button
} from 'flowbite-vue'
import { StringVal } from '@utils/validation.js'

export default {
  name: 'Roles',
  components: {
    Table, TableHead,
    TableBody, TableHeadCell,
    TableRow, TableCell,
    Input, Button
  },
  data() {
    return {
      AllRoles: Array(),
      roles: Array(),
      errored: Boolean(),
      CreatingName: String(),
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
    this.GetRoles()
  },
  methods: {
    GetRoles() {
      this.ax.get('roles').then(r => {
        console.log(r.data.data)
        this.AllRoles = r.data.data
        this.roles = this.AllRoles
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
        this.errored = true
      })
    },
    Create() {
      if (StringVal(this.CreatingName)) return

      this.ax.post('roles', {
        name: this.CreatingName,
      }).then(r => {
        this.toast(r.data.message, r.data.status ? 'success' : 'error')
        if (!r.data.status) return

        this.AllRoles.push(r.data.data)
        this.roles = this.AllRoles
        this.CreatingName = ''
      }).catch(e => {
        this.toast(e.response.data.message, 'error')
      })
    },
    Patch(data) {
      console.log(data)
    },
    Delete(id) {
      console.log(id)
    },
    Search() {
      const id = this.search.replaceAll(/[^0-9]+/g, '')
      const text = this.search.replaceAll(/[^А-яA-z ]+/g, '').toLowerCase()

      this.roles = this.AllRoles.filter(u => 
        id.length > 0 && u.id.toString().includes(id) ||
        text.length > 0 && u.name.toLowerCase().includes(text)
      )
    },
    ClearSearch() {
      this.search = ''
      this.roles = this.AllRoles
    },
    PrepareForPatch(data = null) {
      this.PatchingId = data?.id ?? 0
      this.PatchingName = data?.name
    },
  }
}
</script>

<template>
<div v-if="AllRoles.length > 0" class="space-y-4">
  <div class="flex flex-wrap space-x-3 w-1/2">
    <Input @keyup.enter="Search()" v-model.trim="search" placeholder="Введите id или иазвание" label="" class="flex-1">
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
        <TableCell>~{{ AllRoles.length+1 }}</TableCell>
        <TableCell>
          <Input v-model.trim="CreatingName" placeholder="Введите название новой группы" />
        </TableCell>
        <TableCell>
          <div class="space-x-3">
            <Button :disabled="CreatingName.length < 3" @click="Create()" color="green">Добавить</Button>
            <Button v-if="CreatingName.length > 0" @click="CreatingName = ''" color="light">Сброс</Button>
          </div>
        </TableCell>
      </TableRow>
      
      <TableRow v-for="r in roles">
        <TableCell>{{ r.id }}</TableCell>
        <TableCell>
          <p v-if="PatchingId != r.id">{{ r.name }}</p>
          <Input v-else v-model.trim="PatchingName" placeholder="Введите новое название" />
        </TableCell>
        <TableCell>
          <div v-if="PatchingId == r.id" class="space-x-3">
            <Button @click="Patch(r.id)" color="green">Сохранить</Button>
            <Button @click="PrepareForPatch()" color="light">Отменить</Button>
          </div>
          <div v-else class="space-x-3">
            <Button @click="PrepareForPatch(r)" color="light">Редактировать</Button>
            <Button @click="Delete(r.id)" color="red">Удалить</Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>

<div v-else>
  <div v-if="errored">
    <p>Ошибка</p>
  </div>
  <div v-else>
    <p>Нет данных</p>
  </div>
</div>
</template>
