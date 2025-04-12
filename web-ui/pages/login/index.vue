<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { ref, reactive } from 'vue'
const error = ref('')
const { login } = useAuth()
const toast = useToast()

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  error.value = ''
  try {
    const result = await login(state.email, state.password)
    toast.add({
      title: 'Success',
      description: 'You are now logged in.',
      color: 'success'
    })
    setTimeout(() => {
      navigateTo('/admin');
    }, 100);
  } catch {
    toast.add({
      title: 'Login failed',
      description: 'Please check your credentials and try again.',
      color: 'error'
    })
    return;
  }
}

</script>

<template>
  <div class="flex flex-col gap-y-2 items-center">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField>

      <UButton type="submit" color="primary">
        Login
      </UButton>
    </UForm>
  </div>
</template>