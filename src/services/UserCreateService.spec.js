const UserCreateService = require('./UserCreateService');
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory');

it("user should be create", async () => {
	const user = {
		name: "User Test",
		email: "user@teste.com",
		password: "123"
	};

	const userRepositoryInMemory = new UserRepositoryInMemory();
	const userCreateService = new UserCreateService(userRepositoryInMemory);
	const userCreated = await userCreateService.execute(user); //espera id no userCreated

	expect(userCreated).toHaveProperty("id");
});