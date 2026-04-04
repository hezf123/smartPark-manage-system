import axios from "axios";

export const fetchRegistrations = async () => {
    return axios.get("http://localhost:3001/api/registrations");
};


export const addRegistrations = async (data: {
    name: string,
    email: string,
    club: string
}) => {
    return axios.post("http://localhost:3001/api/registrations", data);
};

export const deleteRegistrations = async (id: number) => {
    return axios.delete(`http://localhost:3001/api/registrations/${id}`);
};