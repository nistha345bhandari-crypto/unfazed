import { useEffect, useState } from "react";
import API from "../services/api";

function useEntitlement(featureKey) {
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkEntitlement = async () => {
            try {
                const token =
                    localStorage.getItem(
                        "therapistToken"
                    );

                if (!token) {
                    setAllowed(false);
                    return;
                }

                const response = await API.get(
                    `/entitlements/check/${featureKey}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setAllowed(
                    response.data.allowed === true
                );
            } catch (error) {
                console.error(
                    "ENTITLEMENT CHECK ERROR:",
                    error
                );

                setAllowed(false);
            } finally {
                setLoading(false);
            }
        };

        checkEntitlement();
    }, [featureKey]);

    return {
        allowed,
        loading,
    };
}

export default useEntitlement;