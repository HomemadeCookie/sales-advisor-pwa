"use client";

import FormSelect from "@/components/form-select";
import firebaseConfig from "@/configs/firebase_config";
import { BusinessModel } from "@/types/firebase/business_model";
import { Category } from "@/types/firebase/category";
import { Country } from "@/types/firebase/country";
import { Delegation } from "@/types/firebase/delegations";
import { State } from "@/types/firebase/state";
import { User } from "@/types/firebase/user/user";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Page = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // TODO: This value should be retrieved
  const currentUser = "TEST"; // User['uuid'] (Retreive from logged in user)

  // FormSelect options
  const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ value: string; label: string }[]>([]);
  const [stateOptions, setStateOptions] = useState<{ value: string; label: string }[]>([]);
  const [modelOptions, setModelOptions] = useState<{ value: string; label: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  // FormSelect value
  const [countryOptionValue, setCountryOptionValue] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [stateOptionValue, setStateOptionValue] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [modelOptionValue, setModelOptionValue] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [categoryOptionValue, setCategoryOptionValue] = useState<{
    value: string;
    label: string;
  } | null>(null);

  // Selected salesperson values
  const [salespersonId, setSalesPersonId] = useState<string | null>(null);
  const [delegationId, setDelegationId] = useState<string | null>(null);

  // Currently assigned values
  const [countryId, setCountryId] = useState<string | null>(null);
  const [stateId, setStateId] = useState<string | null>(null);
  const [businessModelId, setBusinessModelId] = useState<string | null>(null);
  const [businessCategoryId, setBusinessCategoryId] = useState<string | null>(null);

  // FormSelect delegation values
  const [newCountryId, setNewCountryId] = useState<string | null>(null);
  const [newStateId, setNewStateId] = useState<string | null>(null);
  const [newBusinessModelId, setNewBusinessModelId] = useState<string | null>(null);
  const [newBusinessCategoryId, setNewBusinessCategoryId] = useState<string | null>(null);

  // TODO: Move outside of this file for code reusability
  // Firebase functions
  const fetchUsers = async () => {
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(
      query(usersCol, where("managedByRefs", "array-contains", currentUser))
    );
    const users: User[] = [];
    userSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.username) {
        const user: User = {
          uuid: doc.id,
          name: userData.name,
          username: userData.username,
          birthdate: userData.birthdate,
          sex: userData.sex,
          accountRolesRefs: userData.accountRolesRefs,
          emailAddressesRefs: userData.emailAddressesRefs,
          contactNumbersRefs: userData.contactNumbersRefs,
          socialMediasRefs: userData.socialMediasRefs,
          managedUsersRefs: userData.managedUsersRefs,
          managedByRefs: userData.managedByRefs,
          delegationsRefs: userData.delegationsRefs,
          addedAt: userData.addedAt,
          addedByRef: userData.addedByRef,
          updatedAt: userData.updatedAt,
          updatedByRef: userData.updatedByRef,
          deletedAt: userData.deletedAt,
          deletedByRef: userData.deletedByRef,
          itinerariesRefs: userData.itinerariesRefs,
        };
        users.push(user);
      }
    });
    return users;
  };
  const fetchCountries = async () => {
    const countriesCol = collection(db, "countries");
    const countrySnapshot = await getDocs(countriesCol);
    const countries: Country[] = [];
    countrySnapshot.forEach((doc) => {
      const countryData = doc.data();
      const country: Country = {
        uuid: doc.id,
        name: countryData.name,
        code: countryData.code,

        // Metadata
        addedAt: countryData.addedAt,
        addedByRef: countryData.addedByRef,
        updatedAt: countryData.updatedAt,
        updatedByRef: countryData.updatedByRef,
        deletedAt: countryData.deletedAt,
        deletedByRef: countryData.deletedByRef,
      };
      countries.push(country);
    });
    return countries;
  };
  const fetchStates = async (countryId: string) => {
    const statesCol = collection(db, "states");
    const stateSnapshot = await getDocs(query(statesCol, where("countryRef", "==", countryId)));
    const states: State[] = [];
    stateSnapshot.forEach((doc) => {
      const stateData = doc.data();
      const state: State = {
        uuid: doc.id,
        name: stateData.name,
        countryRef: stateData.countryRef,

        // Metadata
        addedAt: stateData.addedAt,
        addedByRef: stateData.addedByRef,
        updatedAt: stateData.updatedAt,
        updatedByRef: stateData.updatedByRef,
        deletedAt: stateData.deletedAt,
        deletedByRef: stateData.deletedByRef,
      };
      states.push(state);
    });
    return states;
  };
  const fetchBusinessModels = async () => {
    const modelsCol = collection(db, "businessModels");
    const modelSnapshot = await getDocs(modelsCol);
    const models: BusinessModel[] = [];
    modelSnapshot.forEach((doc) => {
      const bmData = doc.data();
      const model: BusinessModel = {
        uuid: doc.id,
        name: bmData.name,

        // Metadata
        addedAt: bmData.addedAt,
        addedByRef: bmData.addedByRef,
        updatedAt: bmData.updatedAt,
        updatedByRef: bmData.updatedByRef,
        deletedAt: bmData.deletedAt,
        deletedByRef: bmData.deletedByRef,
      };
      models.push(model);
    });
    return models;
  };
  const fetchBusinessCategories = async () => {
    const categoriesCol = collection(db, "categories");
    const categorySnapshot = await getDocs(categoriesCol);
    const categories: Category[] = [];
    categorySnapshot.forEach((doc) => {
      const categoryData = doc.data();
      const category: Category = {
        uuid: doc.id,
        name: categoryData.name,

        // Metadata
        addedAt: categoryData.addedAt,
        addedByRef: categoryData.addedByRef,
        updatedAt: categoryData.updatedAt,
        updatedByRef: categoryData.updatedByRef,
        deletedAt: categoryData.deletedAt,
        deletedByRef: categoryData.deletedByRef,
      };
      categories.push(category);
    });
    return categories;
  };
  const fetchDelegation = async (delegateeId: string) => {
    const delegationsCol = collection(db, "delegations");
    const delegationSnapshot = await getDocs(
      query(delegationsCol, where("delegateeRef", "==", delegateeId))
    );
    if (delegationSnapshot.docs.length > 0) {
      const delegationData = delegationSnapshot.docs[0].data();
      const delegation: Delegation = {
        uuid: delegationSnapshot.docs[0].id,
        delegatorRef: delegationData.delegatorRef,
        delegateeRef: delegationData.delegateeRef,
        countriesRefs: delegationData.countriesRefs,
        statesRefs: delegationData.statesRefs,
        businessModelsRefs: delegationData.businessModelsRefs,
        annualSalesGroupsRefs: delegationData.annualSalesGroupsRefs,
        categoriesRefs: delegationData.categoriesRefs,
        subcategoriesRefs: delegationData.subcategoriesRefs,

        // Metadata
        addedAt: delegationData.addedAt,
        addedByRef: delegationData.addedByRef,
        updatedAt: delegationData.updatedAt,
        updatedByRef: delegationData.updatedByRef,
        deletedAt: delegationData.deletedAt,
        deletedByRef: delegationData.deletedByRef,
      };
      return delegation;
    }
    return null;
  };

  // FormSelect listeners
  const onNewSalesPersonChanged = (userId: string) => {
    setSalesPersonId(userId);

    // Get delegations of the newly selected user
    fetchDelegation(userId)
      .then((delegation) => {
        if (delegation == null) return;
        setDelegationId(delegation.uuid);

        if (delegation.countriesRefs && delegation.countriesRefs.length > 0) {
          setCountryId(delegation.countriesRefs[0]);
          setNewCountryId(delegation.countriesRefs[0]);
          fetchStates(delegation.countriesRefs[0])
            .then((states) => {
              const newStateOptions = states.map((model) => ({
                value: model.uuid,
                label: model.name,
              }));
              setStateOptions(newStateOptions);
              if (delegation.statesRefs && delegation.statesRefs.length > 0) {
                const stateRef = delegation.statesRefs[0];
                setStateId(stateRef);
                setNewStateId(stateRef);
                const stateSelected = newStateOptions.find((item) => item.value === stateRef);
                if (stateSelected) setStateOptionValue(stateSelected);
              }
            })
            .catch((error) => {
              console.error("Error fetching states:", error);
            });
        }
        if (delegation.businessModelsRefs && delegation.businessModelsRefs.length > 0) {
          setBusinessModelId(delegation.businessModelsRefs[0]);
          setNewBusinessModelId(delegation.businessModelsRefs[0]);
        }
        if (delegation.categoriesRefs && delegation.categoriesRefs.length > 0) {
          setBusinessCategoryId(delegation.categoriesRefs[0]);
          setNewBusinessCategoryId(delegation.categoriesRefs[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching delegations:", error);
        setDelegationId(null);
      });
  };
  const onNewCountryChanged = (newId: string) => {
    setNewCountryId(newId);
    const selected = countryOptions.find((item) => item.value === newId);
    if (selected) setCountryOptionValue(selected);

    // Get the states under this country and update options of the State FormSelect
    fetchStates(newId)
      .then((state) => {
        setStateOptions(
          state.map((model) => ({
            value: model.uuid,
            label: model.name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
    setNewStateId(null);
    setStateOptionValue(null);
  };
  const onNewStateChanged = (newId: string) => {
    setNewStateId(newId);
    const selected = stateOptions.find((item) => item.value === newId);
    if (selected) setStateOptionValue(selected);
  };
  const onNewBusinessModelChanged = (newId: string) => {
    setNewBusinessModelId(newId);
    const selected = modelOptions.find((item) => item.value === newId);
    if (selected) setModelOptionValue(selected);
  };
  const onNewBusinessCategoryChanged = (newId: string) => {
    setNewBusinessCategoryId(newId);
    const selected = categoryOptions.find((item) => item.value === newId);
    if (selected) setCategoryOptionValue(selected);
  };

  // Form action buttons
  const resetForm = () => {
    const defaulCountryOption = countryOptions.find((item) => item.value === countryId);
    const defaultModelOption = modelOptions.find((item) => item.value === businessModelId);
    const defaultCategoryOption = categoryOptions.find((item) => item.value === businessCategoryId);

    setNewCountryId(countryId);
    if (defaulCountryOption) setCountryOptionValue(defaulCountryOption);
    if (countryId) {
      // Get the states under this country and update options of the State FormSelect
      fetchStates(countryId).then((states) => {
        const newStateOptions = states.map((model) => ({
          value: model.uuid,
          label: model.name,
        }));
        setStateOptions(newStateOptions);
        const stateSelected = newStateOptions.find((item) => item.value === stateId);
        if (stateSelected) setStateOptionValue(stateSelected);
      });
    }

    setModelOptionValue(defaultModelOption ?? null);
    setCategoryOptionValue(defaultCategoryOption ?? null);
  };
  const applyForm = async () => {
    if (salespersonId == null) return;

    // Retrieve delegations from form-select values
    const newDelegations = {
      countriesRefs: [newCountryId],
      statesRefs: [newStateId],
      businessModelsRefs: [newBusinessModelId],
      categoriesRefs: [newBusinessCategoryId],
    };

    setCountryId(newCountryId);
    setStateId(newStateId);
    setBusinessModelId(newBusinessModelId);
    setBusinessCategoryId(newBusinessCategoryId);

    // Create delegation document if it doesn't exist, otherwise update it
    if (delegationId == null) {
      try {
        const docRef = await addDoc(collection(db, "delegations"), newDelegations);
        setDelegationId(docRef.id);
      } catch (error) {
        console.error("Error creating delegation:", error);
      }
    } else {
      const delegationRef = doc(db, "delegations", delegationId);
      try {
        await updateDoc(delegationRef, newDelegations);
      } catch (error) {
        console.error("Error updating delegation:", error);
      }
    }
  };

  useEffect(() => {
    resetForm();
    console.log("reset");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId, stateId, businessModelId, businessCategoryId]);

  useEffect(() => {
    // Fetch data from server and  the initial options of the FormSelects
    fetchUsers()
      .then((data) => {
        setUserOptions(
          data.map((user) => ({
            value: user.uuid,
            label: user.name.firstName + " " + user.name.lastName,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    fetchCountries()
      .then((data) => {
        setCountryOptions(
          data.map((model) => ({
            value: model.uuid,
            label: model.name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
    fetchBusinessModels()
      .then((data) => {
        setModelOptions(
          data.map((model) => ({
            value: model.uuid,
            label: model.name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching business models:", error);
      });
    fetchBusinessCategories()
      .then((data) => {
        setCategoryOptions(
          data.map((model) => ({
            value: model.uuid,
            label: model.name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching business categories:", error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto px-4 py-8 md:max-w-6xl lg:py-16">
      <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">Delegation</h1>

      <div className="mb-8 rounded-lg p-6 shadow">
        <FormSelect
          title="Salesperson:"
          onSelectChange={onNewSalesPersonChanged}
          options={userOptions}
        />
      </div>

      {/* Delegations dropdown */}
      <div className="mb-8 rounded-lg p-6 shadow">
        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <FormSelect
            title="Country:"
            onSelectChange={onNewCountryChanged}
            options={countryOptions}
            value={countryOptionValue}
          />
          <FormSelect
            title="State:"
            onSelectChange={onNewStateChanged}
            options={stateOptions}
            value={stateOptionValue}
          />
          <FormSelect
            title="Business Model:"
            onSelectChange={onNewBusinessModelChanged}
            options={modelOptions}
            value={modelOptionValue}
          />
          <FormSelect
            title="Business Category:"
            onSelectChange={onNewBusinessCategoryChanged}
            options={categoryOptions}
            value={categoryOptionValue}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="me-4 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            onClick={resetForm}
          >
            Reset
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={applyForm}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
