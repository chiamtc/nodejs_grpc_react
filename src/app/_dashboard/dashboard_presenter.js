import React from 'react';
import {fetchUserDetails} from 'shared_interactor';
import {setUnitPref} from 'unitPref';
import {Doughnut} from 'react-chartjs-2';
import _ from "lodash";
import {CardView, UserDetailRow} from '@m3dicine/core'
import GGMapDashNew from "sharedComponents/google_map_dash";
import {AppConfig, STETHEE_VET, STETHEE_PRO} from 'configuration'

const loadDoughnut = (data) => {
    if (!_.isEmpty(data)) {
        return (
            <div className="innerChart">
                <Doughnut className="dough" data={data} width={150} height={150} options={{
                    maintainAspectRatio: true,
                    cutoutPercentage: 80,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: true
                    }
                }}/>
            </div>
        );
    }
}

export const loadUserDetails = (user, clinicName) => {
    let userDetails = user ? user : '--';
    let firstName = userDetails.firstName || '--';
    let lastName = userDetails.lastName || '--';
    return (
        <div>
            <CardView>
                <div
                    className="withHalo">{AppConfig.dashboard.labels['82161cfb-d6b3-4c6d-984c-8be199fc12e3'].translate}
                    {firstName + " " + lastName}
                </div>
                <div>
                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels['ca74a97d-ab67-4163-949a-3d4f86c24d20'].translate}
                        email={userDetails.email || '--'}/>
                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels['b8b9ffbf-a016-426e-8a2a-ef45e57af63c'].translate}
                        phone={userDetails.phoneNumber || '--'}/>
                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels['0fb64e06-828d-4589-bc9d-017418affa08'].translate}
                        detail={clinicName || '--'}/>
                </div>
            </CardView>
        </div>);
}

export const loadGMap = (orphanSamples, assignSamples) => {
    const coords = [];
    const gMapCoords = [];
    if (orphanSamples && assignSamples) {
        for (let i in orphanSamples) {
            let {geoData, url, sampleName} = orphanSamples[i];
            if (!geoData) continue;
            coords.push({geoData: geoData.lonlat, url, sampleName});
        }
        for (let i in assignSamples) {
            let {geoData, url, sampleName} = assignSamples[i];
            if (!geoData) continue;
            coords.push({geoData: geoData.lonlat, url, sampleName});
        }
    }

    for (let index in coords) {
        let rec = coords[index];
        let pos = {
            coor: {
                lat: Number(rec.geoData.lat),
                lng: Number(rec.geoData.lon)
            },
            title: rec.sampleName,
            key: rec.url
        }
        gMapCoords.push(pos)
    }
    return (<GGMapDashNew coordinates={gMapCoords}/>)
}


export const loadSampleStats = (orphanSamples, assignSamples) => {
    const orphanCount = Object.keys(orphanSamples).length > 0 ? Object.keys(orphanSamples).length : '0';
    const assignedCount = Object.keys(assignSamples).length ? Object.keys(assignSamples).length : '0';
    const tempCount = assignedCount + orphanCount
    const totalRecordingsCount = tempCount > 0 ? tempCount : '0';

    const data = {
        labels: [
            AppConfig.dashboard.labels['90016e60-98af-4b79-9e1e-2f3c07abcb5c'].translate,
            AppConfig.dashboard.labels['ffa435a1-88f1-4981-b6f7-da08cf920f37'].translate
        ],
        datasets: [
            {
                label: '# of Samples',
                data: [orphanCount, totalRecordingsCount - orphanCount],
                backgroundColor: [
                    '#f5a623', '#8bc34a'
                ],
                borderWidth: 0
            }
        ]
    };
    return (
        <CardView>
            {AppConfig.dashboard.labels['0c2b4992-8b35-400f-8ba5-087952831c4d'].translate}
            <div className="sampleStats">
                <div className="stats">
                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels['ba07c2ef-10f6-4a96-87a3-76434a2d1863'].translate}
                        detail={totalRecordingsCount}/>

                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels['90016e60-98af-4b79-9e1e-2f3c07abcb5c'].translate}
                        detail={orphanCount}/>
                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels['ffa435a1-88f1-4981-b6f7-da08cf920f37'].translate}
                        detail={assignedCount}/>
                </div>
                <div className="chart">
                    {loadDoughnut(data)}
                </div>

            </div>
        </CardView>
    );
}

export const loadVetOrProStats = (own, shared) => {
    let ownerCount, sharedPetOwnerCount, petCount;
    switch (AppConfig.appName) {
        case STETHEE_VET:
            ownerCount = own.length > 0 ? own.length : '0';
            sharedPetOwnerCount = shared.length > 0 ? shared.length : 0;
            petCount = 0;
            let petVetOwnersCount = own;
            let petVetSharedOwnersCount = shared;
            const totalArray = [...petVetOwnersCount.concat(petVetSharedOwnersCount).reduce((acc, curr) =>
                acc.set(curr.ownerId, Object.assign(acc.get(curr.ownerId) || {}, curr)), new Map()).values()]
                .map(ele => {
                    if (ele.ownerPets) petCount += Object.keys(ele.ownerPets).length
                });
            break;
        case STETHEE_PRO:
            ownerCount = own ? own : '0';
            sharedPetOwnerCount = shared ? shared : '0';
            petCount = own + shared > 0 ? own + shared : '0';
            break;
    }

    const data = {
        labels: [
            AppConfig.dashboard.labels['4f0b0140-0e09-4085-bb7b-0cc38bdfa5fc'].translate,
            AppConfig.dashboard.labels['ca3830bd-ad92-4fe6-ad19-0f0de0bfd379'].translate
        ],
        datasets: [
            {
                label: '# of Patients',
                data: [ownerCount, sharedPetOwnerCount],
                backgroundColor: [
                    '#FF6384', '#36A2EB'
                ],
                borderWidth: 0
            }
        ]
    };
    return (
        <CardView>
            <p>{AppConfig.dashboard.labels['06b7682d-1cf3-44fd-806e-6ceccb4029d4'].translate}</p>
            <div className="sampleStats">
                <div className="stats">
                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels["948a54d9-20bc-4173-8355-020ac2d313e6"].translate}
                        detail={petCount}/>
                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels["4f0b0140-0e09-4085-bb7b-0cc38bdfa5fc"].translate}
                        detail={ownerCount}/>
                    <UserDetailRow
                        underline={true}
                        title={AppConfig.dashboard.labels["ca3830bd-ad92-4fe6-ad19-0f0de0bfd379"].translate}
                        detail={sharedPetOwnerCount}/>
                </div>
                <div className="chart">
                    {loadDoughnut(data)}
                </div>
            </div>
        </CardView>
    );
}
