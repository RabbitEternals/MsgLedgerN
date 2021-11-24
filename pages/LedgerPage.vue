<template>
  <div class="m-3">
    <div class="mb-3">
      <label for="emailField" class="form-label">Email</label>
      <input id="emailField" type="email" class="form-control" placeholder="Email" v-model="email"/>
      <span class="badge badge-pill badge-danger" v-show="showHelp" style="background-color: red">Invalid mail</span>
    </div>
    <div class="mb-3">
      <label for="messageField" class="form-label">Message</label>
      <input id="messageField" class="form-control" placeholder="Message" v-model="message"/>
    </div>
    <button class="btn btn-primary mb-4" :disabled="isDisabled && apiProgress" @click="add">Add</button>
    <br>
    <button class="btn btn-outline-secondary btn-sm float-start" @click="showData(page - 1)"
            v-show="page > 1">Previous
    </button>
    <button class="btn btn-outline-secondary btn-sm float-end" @click="showData(page + 1)"
            v-show="allMessages.length>=10">Next
    </button>
    <br>
    <ul class="list-group list-group-flush">
      <div class="row">
        <Card class="col-md-4" v-for="card in allMessages" :key="card.email" :card="card"/>
      </div>
    </ul>
  </div>
</template>

<script>
import Card from "../components/Card";
import {createMessage, loadMessages} from "../api/apiCalls";

export default {
  name: "LedgerPage",
  components: {Card},
  data() {
    return {
      email: "",
      message: "",
      allMessages: [],
      showHelp: false,
      page: 1,
      apiProgress: false
    }
  },
  methods: {
    async add() {
      this.apiProgress = true;
      if (document.getElementById("emailField").validity.valid) {
        try {
          await createMessage({
            email: this.email,
            message: this.message
          }).then(() => {
            this.allMessages.push({
              email: this.email,
              message: this.message
            });
            this.email = "";
            this.message = "";
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        this.showHelp = true;
      }
      this.apiProgress = false;
    },
    async showData(pageIndex) {
      this.apiProgress = true;
      const response = await loadMessages(pageIndex);
      this.page = pageIndex;
      this.allMessages = response.data;
      this.apiProgress = false;
    }
  },
  computed: {
    isDisabled() {
      return !(this.email && this.message);
    }
  },
  watch: {
    email() {
      this.showHelp = false;
    }
  },
  async mounted() {
    await this.showData(this.page);
  }
}
</script>

<style scoped>

</style>
