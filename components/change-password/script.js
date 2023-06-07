app.component('change-password', {
    template: $TEMPLATES['change-password'],

    components: {
        VueRecaptcha
    },

    setup() {
        const messages = useMessages();
        const text = Utils.getTexts('change-password')
        return { text, messages }
    },

    data() {
        return { 
            passwordRules: {},
            currentPassword: null,
            newPassword: null,
            confirmNewPassword: null
        }
    },

    props: {
        entity: {
            type: Entity,
            required: true
        }
    },

    mounted() {        
        let api = new API();
        api.GET($MAPAS.baseURL + "auth/passwordvalidationinfos").then(async response => response.json().then(validations => {
            this.passwordRules = validations.passwordRules;
        }));
    },

    methods: {
        async changePassword(modal) {
            let api = new API();
            if (this.$refs.currentPassword) {
                let data = {
                    'current_password': this.currentPassword,
                    'new_password': this.newPassword,
                    'confirm_new_password': this.confirmNewPassword,
                }
                await api.POST($MAPAS.baseURL+"autenticacao/changepassword", data).then(response => response.json().then(dataReturn => {
                    if (dataReturn.error) {
                        this.throwErrors(dataReturn.data);
                    } else {
                        this.messages.success('Senha alterada com sucesso!');
                        this.cancel(modal);
                    }
                }));
            } else {
                let data = {
                    'new_password': this.newPassword,
                    'confirm_new_password': this.confirmNewPassword,
                    'email': this.entity.email,
                }
                await api.POST($MAPAS.baseURL+"autenticacao/adminchangeuserpassword", data).then(response => response.json().then(dataReturn => {
                    if (dataReturn.error) {
                        this.throwErrors(dataReturn.data);
                    } else {
                        this.messages.success('Senha alterada com sucesso!');
                        this.cancel(modal);
                    }
                }));
            }
        },

        cancel(modal) {
            this.newPassword = '';
            this.confirmNewPassword = '';
            modal.close();
        },

        throwErrors(errors) {
            for (let key in errors) {
                for (let val of errors[key]) {
                    this.messages.error(val);
                }
            }
        },
    },
});