import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodData } from '../../types';

function Dashboard() {

  const [foods, setFoods] = useState<FoodData[]>([]);
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);


  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }
    loadFoods();
  },[]);

  async function handleAddFood(food: FoodData) {
    const newFoods = [...foods];

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...newFoods, response.data]);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodData) {

    const newFoods = [...foods];
    const newEditingFood = { ...editingFood };

    const updatedObject = {...newEditingFood, ...food};

    try {
      const foodUpdated = await api.put(
        `/foods/${newEditingFood.id}`,
        updatedObject,
      );

      const foodsUpdated: FoodData[] = newFoods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)

    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {

    const newFoods = [...foods];

    await api.delete(`/foods/${id}`);

    const foodsFiltered = newFoods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodData) {

    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              available={food.available}
            />
          ))}
      </FoodsContainer>
    </>
  );

};

export default Dashboard;
