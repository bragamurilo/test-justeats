import Basket from '../js/Basket';
jest.mock('../js/Basket');

beforeEach(() => {
    // Limpa todas as instâncias e chamadas de construtor e todos os métodos:
    Basket.mockClear();
});

it('Nós podemos verificar se o consumidor chamou o construtor de classe', () => {
    const basket = new Basket();
    expect(Basket).toHaveBeenCalledTimes(1);
});

// test("Resultado deve ser 500",
//     () => {
//         const basket = new Basket();
//         let total = basket.calcTotalAddProduct(100, 5)
//         expect(total).toBe(500)
//     })