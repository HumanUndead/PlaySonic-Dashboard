/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourtQueryInstance } from "@app/useCases/court";
import { IDDlOptionCourt } from "@domain/entities";
import { ICourtBody } from "@domain/entities/Court/Court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { useCallback, useEffect, useState } from "react";

const useClubCourtsDDL = (id: number) => {
  const [ClubCourtsList, setCourts] = useState<ICourtBody>();
  const [ClubCourtsOption, setCourtsOption] = useState<IDDlOptionCourt[]>([]);
  const [isLoading, setIsLoadingCourts] = useState<boolean>(false);

  const fetchCourts = useCallback(async () => {
    try {
      setIsLoadingCourts(true);
      const CourtsListRes = await CourtQueryInstance.getCourtList(
        CourtUrlEnum.GetCourtList + `clubId=${id}`
      );
      const _CourtsOption = CourtsListRes?.data?.map((Court) => {
        return {
          value: Court.id,
          label: Court.name,
          isIndoor: Court.indoor,
        };
      });
      setCourtsOption(_CourtsOption?.length ? _CourtsOption : []);
      setCourts(CourtsListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCourts(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);
  return { ClubCourtsList, isClubCourtLoading: isLoading, ClubCourtsOption };
};

export { useClubCourtsDDL };
